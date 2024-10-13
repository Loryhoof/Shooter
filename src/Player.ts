import * as THREE from "three";
import { Entity } from "./types/types";
import World from "./World";
import Bullet from "./Bullet";

export default class Player extends THREE.Object3D implements Entity {
  private readonly playerName: string;
  private readonly health: number = 100;
  private readonly velocity: THREE.Vector3 = new THREE.Vector3();

  private readonly body: THREE.Object3D;
  private playerCamera: THREE.Camera;

  private speed: number = 0.05;

  public networkId: string;

  private sprinting: boolean = false;

  private keys: { [key: string]: boolean } = {};

  private socket: any;

  constructor(
    socket: any,
    camera: THREE.Camera,
    playerName: string,
    color: THREE.Color
  ) {
    super();

    this.playerName = playerName;
    this.networkId = socket.id;
    this.body = new THREE.Object3D();
    this.playerCamera = camera;
    this.socket = socket;
    this.add(this.body);
    this.init(color);

    this.addKeyListeners();
  }
  init(color: THREE.Color) {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: color,
      })
    );

    this.body.add(cube);
  }
  addKeyListeners() {
    window.addEventListener("keydown", (event) => {
      this.keys[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.code] = false;
    });

    window.addEventListener("mousedown", (e) => {
      if (e.button == 0) {
        this.attack();
      }
    });
  }
  attack() {
    return;
    console.log("attacking...");
    const world = World.getInstance();

    const bullet = new Bullet(20);
    bullet.position.copy(this.position);
    bullet.quaternion.copy(this.playerCamera.quaternion);

    world.addEntity(bullet);

    console.log("World: ", world);
  }
  update() {
    this.updatePhysics();
    this.updateControls();

    this.playerCamera.position.copy(this.position);
  }
  updatePhysics() {
    //this.position.add(this.velocity.clone().multiplyScalar(0.01));
  }
  updateControls() {
    this.velocity.set(0, 0, 0);

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    this.playerCamera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(this.playerCamera.up, forward).normalize();

    const sprintFactor = this.keys["ShiftLeft"] ? 1.7 : 1;

    if (this.keys["KeyW"]) {
      this.velocity.add(forward.multiplyScalar(this.speed * sprintFactor)); // Move forward relative to the camera
    }
    if (this.keys["KeyS"]) {
      this.velocity.add(forward.multiplyScalar(-this.speed * sprintFactor)); // Move backward relative to the camera
    }
    if (this.keys["KeyA"]) {
      this.velocity.add(right.multiplyScalar(this.speed * sprintFactor)); // Move left relative to the camera
    }
    if (this.keys["KeyD"]) {
      this.velocity.add(right.multiplyScalar(-this.speed * sprintFactor)); // Move right relative to the camera
    }

    if (
      this.keys["KeyW"] ||
      this.keys["KeyS"] ||
      this.keys["KeyA"] ||
      this.keys["KeyD"]
    ) {
      this.socket.emit("playerMove", {
        id: this.socket.id,
        velocity: {
          x: this.velocity.x,
          y: this.velocity.y,
          z: this.velocity.z,
        },
      });
    }
  }
}
