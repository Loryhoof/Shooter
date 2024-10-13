import * as THREE from "three";
import { Entity } from "./types/types";

export default class RemotePlayer extends THREE.Object3D implements Entity {
  private readonly playerName: string;
  private readonly health: number = 100;
  private readonly velocity: THREE.Vector3 = new THREE.Vector3();

  private readonly body: THREE.Object3D;

  public networkId: string;

  private speed: number = 0.05;

  private sprinting: boolean = false;

  constructor(networkId: string, playerName: string, color: THREE.Color) {
    super();

    this.playerName = playerName;
    this.networkId = networkId;
    this.body = new THREE.Object3D();
    this.add(this.body);
    this.init(color);
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

  attack() {
    return;
  }
  update() {
    // this.updatePhysics();
    // this.updateControls();
  }
  updatePhysics() {
    //this.position.add(this.velocity.clone().multiplyScalar(0.01));
  }
}
