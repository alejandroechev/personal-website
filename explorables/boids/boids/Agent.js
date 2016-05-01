/// <reference path="References.ts" />
var Boids;
(function (Boids) {
    var Agent = (function () {
        function Agent(position, speed, fov, width, height, color) {
            this.position = position;
            this.speed = speed;
            this.speedIntensity = 100;
            this.width = width;
            this.height = height;
            this.color = color;
            this.fov = fov;
            this.force = new Boids.Vector2D(0, 0);
            this.mass = 1;
        }
        Agent.prototype.update = function (dt) {
            this.speed = this.speed.add(this.force.multiply(1 / this.mass));
            this.speed = this.speed.normalized();
            this.speed = this.speed.multiply(this.speedIntensity);
            this.position = this.position.add(this.speed.multiply(dt));
        };
        Agent.prototype.isNeighbour = function (other, neighbourhoodRadius) {
            if (this.position.distance(other.position) < neighbourhoodRadius) {
                var positionVector = other.position.substract(this.position).normalized();
                var directionVector = this.speed.normalized();
                var angle = Math.acos(positionVector.dot(directionVector));
                return angle < this.fov;
            }
            return false;
        };
        Agent.prototype.modularIsNeighbour = function (other, neighbourhoodRadius, bounds) {
            if (this.position.modularDistance(other.position, bounds) < neighbourhoodRadius) {
                var positionVector = other.position.substract(this.position).normalized();
                var directionVector = this.speed.normalized();
                var angle = Math.acos(positionVector.dot(directionVector));
                return angle < this.fov;
            }
            return false;
        };
        return Agent;
    })();
    Boids.Agent = Agent;
})(Boids || (Boids = {}));
//# sourceMappingURL=Agent.js.map