/* Piotr Dobrowolski, 2022 */
import WebGL from 'three/capabilities/WebGL';
import * as THREE from 'three';
import {animate, initializeScene} from "./experience.js"

let experienceDiv = document.getElementById("experience-div");
let startExperienceBtn, startInVRBtn;

let existingCanvas = document.getElementById("container-scene");

let camera = null;
let renderer = null;
let currentSession = null;
let xrSessionIsGranted = false;

function onWindowResize() {
    var width = Math.max(existingCanvas.parentNode.clientWidth, 100);
    var height = Math.max(window.innerHeight - 50, 100);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

async function initializeApplication() {
    console.log("Application initialization.");
    var width = Math.max(existingCanvas.parentNode.clientWidth, 100);
    var height = Math.max(window.innerHeight - 50, 100);

    initializeScene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: existingCanvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;

    window.addEventListener('resize', onWindowResize);
}

async function onSessionStarted(session) {
    session.addEventListener('end', onSessionEnded);

    await renderer.xr.setSession(session);
    startInVRBtn.querySelector("a").innerHTML = "exit vr";

    currentSession = session;
}

function onSessionEnded(/*event*/) {
    currentSession.removeEventListener('end', onSessionEnded);
    startInVRBtn.querySelector("a").innerHTML = "enter vr";

    currentSession = null;
}

function onSessionStartFailure(exception) {
    console.warn('Exception when trying to call xr.requestSession', exception);
    startInVRBtn.querySelector("a").innerHTML = "retry-enter vr";
}

async function experienceClicked() {
    if (renderer === null)
    {
        document.getElementById("container-scene-div").style.display = "block";
        await initializeApplication();
        animate(renderer, camera);
    }
}

async function vrClicked() {
    experienceClicked().then(function () {
        if (currentSession === null) {
            const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] }; //, "layers"
            navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted).catch(onSessionStartFailure);

        } else {
            currentSession.end();
        }
    });
}

function createItem(faicon, domLink) {
    const item = document.createElement('p');
    const icon = document.createElement('i');
    for (let i of ["fa", "fa-fw", "t-margin-h", "t-large", "t-blue", faicon]) {
        icon.classList.add(i);
    }
    item.appendChild(icon);
    item.appendChild(domLink);
    return item;
}

function createLink(name, hashName, onClick)
{
    const link = document.createElement('a');
    link.href = "#" + hashName;
    link.innerHTML = name;
    link.onclick = onClick;
    return link;
}

function showEnterVR() {
    startInVRBtn = createItem("fa-vr-cardboard", createLink("enter vr", "vr", vrClicked));
    experienceDiv.appendChild(startInVRBtn);
}

function webXRNotFound() {
    console.warn('Session is not supported');
}

function showXRNotAllowed(exception) {
    console.warn('Exception when trying to call xr.isSessionSupported', exception);
}

function experienceAvailable() {
    if (WebGL.isWebGLAvailable()) {
        startExperienceBtn = createItem("fa-cube", createLink("start experience", "360", experienceClicked));
        experienceDiv.appendChild(startExperienceBtn);
        if ("xr" in navigator) {
            navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
                supported ? showEnterVR() : webXRNotFound();
                if (supported && xrSessionIsGranted)
                {
                    startInVRBtn.querySelector("a").click();
                }
            }).catch(showXRNotAllowed);
        }
        return true;
    } else {
        const warning = WebGL.getWebGLErrorMessage();
        console.log("WebGL not available. Log this warning and show just business card.");
        console.warn(warning);
        return false;
    }
}

function registerSessionGrantedListener() {
    if ('xr' in navigator) {
        // WebXRViewer (based on Firefox) has a bug where addEventListener
        // throws a silent exception and aborts execution entirely.
        if (/WebXRViewer\//i.test(navigator.userAgent)) return;

        navigator.xr.addEventListener('sessiongranted', () => {
            xrSessionIsGranted = true;
        });

    }

}

if (window.location.hash == "#earlyAccess")
{
    registerSessionGrantedListener();
    if (experienceAvailable()) {
        if (window.location.hash == "#360" || window.location.hash == "#vr") {
            startExperienceBtn.querySelector("a").click();
        }
    }
}