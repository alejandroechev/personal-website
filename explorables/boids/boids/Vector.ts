/// <reference path="References.ts" />
namespace Boids {
    export class Vector2D {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        add(other: Vector2D) {
            return new Vector2D(this.x + other.x, this.y + other.y);
        }

        substract(other: Vector2D) {
            return new Vector2D(this.x - other.x, this.y - other.y);
        }

        multiply(value: number) {
            return new Vector2D(this.x * value, this.y * value);
        }

        magnitude() {
            return this.distance(new Vector2D(0, 0));
        }

        normalized() {
            var mag = this.magnitude();
            if (mag === 0) return new Vector2D(0, 0);
            return this.multiply(1 / mag);
        }

        distance(other: Vector2D) {
            return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
        }

        dot(other: Vector2D) {
            return this.x * other.x + this.y * other.y;
        }

        toString(other: Vector2D) {
            return `x: ${this.x}, y: ${this.y}`;
        }
    }
}