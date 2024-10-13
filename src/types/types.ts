import * as THREE from "three";

abstract class Entity extends THREE.Object3D {
  abstract networkId: string;
  abstract update(): void;
}

export type { Entity };
