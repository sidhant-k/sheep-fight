import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Delayed } from "colyseus";

export class QueueObject extends Schema {
    @type("number") sheep: number;
}

export class Player extends Schema {
    @type("string") userId: string;
    @type("number") health: number = 100;
    @type("number") lane: number = 0;  
    @type("number") sheep: number = 0;
    @type([QueueObject]) laneQueue1 = new ArraySchema<QueueObject>();
    @type([QueueObject]) laneQueue2 = new ArraySchema<QueueObject>();
    @type([QueueObject]) laneQueue3 = new ArraySchema<QueueObject>();
    @type([QueueObject]) laneQueue4 = new ArraySchema<QueueObject>();
    @type([QueueObject]) laneQueue5 = new ArraySchema<QueueObject>();
    @type([QueueObject]) collisionQueue1 = new ArraySchema<QueueObject>();
    @type([QueueObject]) collisionQueue2 = new ArraySchema<QueueObject>();
    @type([QueueObject]) collisionQueue3 = new ArraySchema<QueueObject>();
    @type([QueueObject]) collisionQueue4 = new ArraySchema<QueueObject>();
    @type([QueueObject]) collisionQueue5 = new ArraySchema<QueueObject>();
    spawnTimer!: Delayed;
    spawnCounter: number = 0;
    spawnFlag: number = 0;
}

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
}