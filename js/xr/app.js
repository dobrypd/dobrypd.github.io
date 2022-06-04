/* Piotr Dobrowolkski, 2022 */
import WebGL from 'three/capabilities/WebGL';
import * as THREE from 'three';
import { OrbitControls } from 'three/OrbitControls';
import { VRButton } from './XRButton.js';

let existingCanvas = document.getElementById("container-scene");
let camera, scene, renderer;
let cube;

function mainLoop() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

function onWindowResize() {
    var width = existingCanvas.width;
    var height = existingCanvas.height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function animate() {
    renderer.setAnimationLoop(mainLoop);
}

function initializeApplication() {
    var width = existingCanvas.width;
    var height = existingCanvas.height;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: existingCanvas });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;

    var buttonContainer = document.getElementById("xr-button");
    buttonContainer.appendChild(VRButton.createButton(renderer));

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = new THREE.TextureLoader().load('PD.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    window.addEventListener('resize', onWindowResize);
}

function initXR() {

}

if (WebGL.isWebGLAvailable()) {
    initializeApplication();
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    console.log("WebGL not available. Log this warning and show just business card.");
    console.warn(warning);
}
