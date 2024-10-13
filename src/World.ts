import * as THREE from "three";
import { Entity } from "./types/types";
import Player from "./Player";

import { io } from "socket.io-client";
import RemotePlayer from "./RemotePlayer";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server", socket.id);

  const world = World.getInstance();

  const player = new Player(
    socket,
    world.getCamera(),
    "glub",
    new THREE.Color(0xff00ff)
  );
  world.addEntity(player);
  player.position.set(0, 0.5, 0);
});

socket.on(
  "updatePlayerPosition",
  (data: { id: string; position: { x: number; y: number; z: number } }) => {
    console.log(data.id, "data id");
    const world = World.getInstance();
    const entities = world.getEntities();

    const networkEntity = entities.find((item) => item.networkId == data.id);

    if (!networkEntity) {
      return;
    }

    networkEntity.position.set(
      data.position.x,
      data.position.y,
      data.position.z
    );
  }
);

socket.on("user-list", (data) => {
  for (const [key, value] of Object.entries(data)) {
    if (key == socket.id) {
      return;
    }

    const world = World.getInstance();
    const entities = world.getEntities();

    const networkEntity = entities.find((item) => item.networkId == key);

    if (networkEntity) {
      return console.log("User already exists");
    }

    const otherPlayer = new RemotePlayer(
      key,
      "npc",
      new THREE.Color(0x00c4f5 * Math.random())
    );
    world.addEntity(otherPlayer);
    otherPlayer.position.set(0, 0.5, 0);
  }
});

socket.on("userJoined", (data) => {
  const world = World.getInstance();
  const otherPlayer = new RemotePlayer(
    data.id,
    "npc",
    new THREE.Color(0x00c4f5 * Math.random())
  );
  world.addEntity(otherPlayer);
  otherPlayer.position.set(0, 0.5, 0);

  console.log("user joined: ", data);
});

export default class World {
  private static instance: World;
  private entities: Entity[] = [];
  private scene: THREE.Scene;
  private camera: THREE.Camera;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.entities = [];
    this.scene = scene;
    this.camera = camera;
    this.init();
  }

  public static initialize(scene: THREE.Scene, camera: THREE.Camera) {
    if (!World.instance) {
      World.instance = new World(scene, camera);
    }
  }

  public static getInstance(): World {
    if (!World.instance) {
      throw new Error("World has not been initialized yet.");
    }
    return World.instance;
  }

  getCamera() {
    return this.camera;
  }

  init() {
    console.log("A new world...");
    console.log("This is our scene: ", this.scene);
    console.log("This is our camera: ", this.camera);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 100, 100),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: 0xff0000 })
    // );
    // cube.position.y = 0.5;
    // this.scene.add(cube);
  }

  addEntity(entity: Entity) {
    this.scene.add(entity);
    this.entities.push(entity);
    console.log(this.entities, "entities");
  }

  getEntities() {
    return this.entities;
  }

  update() {
    // Update entities
    for (let entity of this.entities) {
      entity.update();
    }
  }
}
