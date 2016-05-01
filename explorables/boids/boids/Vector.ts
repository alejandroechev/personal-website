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

        modularDistance(other: Vector2D, bounds: Vector2D) {
            var absX = Math.abs(this.x - other.x);
            var absY = Math.abs(this.y - other.y);
            return Math.sqrt(Math.pow(Math.min(absX, bounds.x - absX), 2) + Math.pow(Math.min(absY, bounds.y - absY), 2));
        }

        dot(other: Vector2D) {
            return this.x * other.x + this.y * other.y;
        }

        toString(other: Vector2D) {
            return `x: ${this.x}, y: ${this.y}`;
        }
    }
}