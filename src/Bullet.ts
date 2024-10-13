import * as THREE from "three";
import { Entity } from "./types/types";

export default class Bullet extends THREE.Object3D implements Entity {
  private damage: number;
  private speed: number = 0.05;
  constructor(damage: number = 50) {
    super();
    this.damage = damage;
    this.init();
  }
  init() {
    const bulletObject = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xf5c800 })
    );
    this.add(bulletObject);
  }
  update(): void {
    this.position.add(
      new THREE.Vector3(0, -0.0001, -this.speed).applyQuaternion(
        this.quaternion
      )
    );
  }
}
