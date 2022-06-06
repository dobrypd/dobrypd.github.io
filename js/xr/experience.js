import * as THREE from 'three';

let scene;
let cube;
let renderer, camera;

function mainLoop() {
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = -2;

    renderer.render(scene, camera);
}

function animate(onARenderer, withACamera) {
    console.log("Starting the animation.");
    renderer = onARenderer;
    camera = withACamera;
    onARenderer.setAnimationLoop(mainLoop);
}

function initializeScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = new THREE.TextureLoader().load('PD.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

export { animate, initializeScene};