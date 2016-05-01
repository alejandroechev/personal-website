/// <reference path="References.ts" />
var Boids;
(function (Boids) {
    var Vector2D = (function () {
        function Vector2D(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2D.prototype.add = function (other) {
            return new Vector2D(this.x + other.x, this.y + other.y);
        };
        Vector2D.prototype.substract = function (other) {
            return new Vector2D(this.x - other.x, this.y - other.y);
        };
        Vector2D.prototype.multiply = function (value) {
            return new Vector2D(this.x * value, this.y * value);
        };
        Vector2D.prototype.magnitude = function () {
            return this.distance(new Vector2D(0, 0));
        };
        Vector2D.prototype.normalized = function () {
            var mag = this.magnitude();
            if (mag === 0)
                return new Vector2D(0, 0);
            return this.multiply(1 / mag);
        };
        Vector2D.prototype.distance = function (other) {
            return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
        };
        Vector2D.prototype.modularDistance = function (other, bounds) {
            var absX = Math.abs(this.x - other.x);
            var absY = Math.abs(this.y - other.y);
            return Math.sqrt(Math.pow(Math.min(absX, bounds.x - absX), 2) + Math.pow(Math.min(absY, bounds.y - absY), 2));
        };
        Vector2D.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };
        Vector2D.prototype.toString = function (other) {
            return "x: " + this.x + ", y: " + this.y;
        };
        return Vector2D;
    })();
    Boids.Vector2D = Vector2D;
})(Boids || (Boids = {}));
//# sourceMappingURL=Vector.js.map