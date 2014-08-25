


function Vector(x,y){
   this.x = x;
   this.y = y;
}

Vector.prototype = {
    add: function (other) {
        return new Vector(this.x + other.x, this.y + other.y);
    },
    substract: function (other) {
        return new Vector(this.x - other.x, this.y - other.y);
    },
    multiply: function (value) {
        return new Vector(this.x * value, this.y * value);
    },
    magnitude: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize: function () {
        var mag = this.magnitude();
        if (mag == 0)
            return new Vector(0, 0);
        return new Vector(this.x / mag, this.y / mag);
    },
    distance: function (other) {
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
    },
    dot: function (other) {
        return this.x * other.x + this.y * other.y;
    },
    cross: function (other) {
        return;
    },
    toString: function () {
        return "x: " + this.x + ", y: " + this.y;
    }

};




function Agent(position, speed, width, height, color) {
   this.position = position;
   this.speed = speed;
   this.speedIntensity = 100;
   this.force = new Vector(0,0);
   this.mass = 1;
   this.width = width;
   this.height = height;
   this.color = color;
   this.fov = Math.PI/2;
   this.tag = 0;
}


Agent.prototype = {
    draw: function(context) {
    },

    setForce: function(force) {
        this.force = force;
    },

    update: function (dt) {

        this.speed = this.speed.add(this.force.multiply(1 / this.mass));
        this.speed = this.speed.normalize();
        this.speed = this.speed.multiply(this.speedIntensity);
        this.position = this.position.add(this.speed.multiply(dt));
    },
    isNeighbour: function(other, neighbourhoodRadius) {
        if (this.position.distance(other.position) < neighbourhoodRadius && this.tag == other.tag) {
            var positionVector = other.position.substract(this.position).normalize();
            var directionVector = this.speed.normalize();
            var angle = Math.acos(positionVector.dot(directionVector));
            return angle < this.fov;
        }
        return false;
    },
    isNeighbourWithTag: function(other, neighbourhoodRadius, tag) {
        if (this.position.distance(other.position) < neighbourhoodRadius && tag == other.tag) {
            var positionVector = other.position.substract(this.position).normalize();
            var directionVector = this.speed.normalize();
            var angle = Math.acos(positionVector.dot(directionVector));
            return angle < this.fov;
        }
        return false;
    }
};








