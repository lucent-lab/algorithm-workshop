export interface Point {
  x: number;
  y: number;
}

export interface Point3D extends Point {
  z: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Ray {
  origin: Point;
  direction: Vector2D;
}

export interface GraphEdge {
  node: string;
  weight?: number;
}

export type Graph = Record<string, GraphEdge[]>;

export interface Agent {
  position: Vector2D;
  velocity: Vector2D;
  maxSpeed: number;
}

export interface SteeringAgent extends Agent {
  maxForce: number;
}

export interface Boid extends SteeringAgent {
  acceleration: Vector2D;
}

/**
 * Crowd agent input used by the RVO solver.
 * Useful for: crowd navigation, swarms, multi-agent avoidance.
 */
export interface RvoAgent extends Agent {
  id?: string;
  radius: number;
  preferredVelocity: Vector2D;
}
