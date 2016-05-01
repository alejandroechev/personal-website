/// <reference path="References.ts" />
namespace Boids {
    
    export class Agent {
        position: Vector2D;
        speed: Vector2D;
        width: number;
        height: number;
        speedIntensity: number;
        color: string;
        fov: number;
        force: Vector2D;
        mass: number;

        constructor(position: Vector2D, speed: Vector2D, fov: number,
            width: number, height: number, color: string) {
            this.position = position;
            this.speed = speed;
            this.speedIntensity = 100;
            this.width = width;
            this.height = height;
            this.color = color;
            this.fov = fov;
            this.force = new Vector2D(0, 0);
            this.mass = 1;
        }

        update(dt: number) {

            this.speed = this.speed.add(this.force.multiply(1 / this.mass));
            this.speed = this.speed.normalized();
            this.speed = this.speed.multiply(this.speedIntensity);
            this.position = this.position.add(this.speed.multiply(dt));
        }

        isNeighbour(other: Agent, neighbourhoodRadius: number) {
            if (this.position.distance(other.position) < neighbourhoodRadius) {
                var positionVector = other.position.substract(this.position).normalized();
                var directionVector = this.speed.normalized();
                var angle = Math.acos(positionVector.dot(directionVector));
                return angle < this.fov;
            }
            return false;
        }

        modularIsNeighbour(other: Agent, neighbourhoodRadius: number, bounds: Vector2D) {
            if (this.position.modularDistance(other.position, bounds) < neighbourhoodRadius) {
                var positionVector = other.position.substract(this.position).normalized();
                var directionVector = this.speed.normalized();
                var angle = Math.acos(positionVector.dot(directionVector));
                return angle < this.fov;
            }
            return false;
        }
    }
}