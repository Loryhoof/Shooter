import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import World from "./World";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const controls = new PointerLockControls(camera, document.body);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

World.initialize(scene, camera);
const world = World.getInstance();

function animate() {
  renderer.render(scene, camera);
  world.update();
}

window.addEventListener("resize", () => {
  let width = window.innerWidth;
  let height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

document.body.addEventListener(
  "click",
  function () {
    //lock mouse on screen
    controls.lock();
  },
  false
);

renderer.setAnimationLoop(animate);
