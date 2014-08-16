


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

function Solver() {

}

Solver.prototype = {
    //Solve position and speed with Euler Method
    solveEuler: function (agent, dt) {
        agent.position = agent.position.add(agent.speed.multiply(dt));
        agent.speed = agent.speed.add(agent.force.multiply(1 / agent.mass));
        agent.speed = agent.speed.normalize();
        agent.speed = agent.speed.multiply(agent.speedIntensity);
    },
    ///Euler-Cromer Time Step, position is updated with new speed http://encinographic.blogspot.com/2013/05/simulation-class-euler-cromer-time-step.html
    solverEulerCromer: function (agent, dt) {
        agent.speed = agent.speed.add(agent.force.multiply(1 / agent.mass));
        agent.speed = agent.speed.normalize();
        agent.speed = agent.speed.multiply(agent.speedIntensity);
        agent.position = agent.position.add(agent.speed.multiply(dt));
    },
    //Solve Runge Kutta 4th Approximation
    solveRK4: function (agent, dt) {

        var a1 = agent.force.multiply(1 / agent.mass);
        var a2 = agent.force.multiply(1 / agent.mass);
        var a3 = agent.force.multiply(1 / agent.mass);
        var a4 = agent.force.multiply(1 / agent.mass);

        var v1 = agent.speed;
        var v2 = agent.speed.add(a1.multiply(dt / 2));
        var v3 = agent.speed.add(a2.multiply(dt / 2));
        var v4 = agent.speed.add(a3.multiply(dt));

        var dt6 = dt / 6;
        var sumV = v1.add(v2.multiply(2).add(v3.multiply(2).add(v4)));
        var sumA = a1.add(a2.multiply(2).add(a3.multiply(2).add(a4)));

        agent.position = agent.position.add(sumV.multiply(dt6));
        agent.speed = agent.speed.add(sumA.multiply(dt6));
        //agent.speed = agent.speed.normalize();
        //agent.speed = agent.speed.multiply(agent.speedIntensity);
    },
};


function Agent(position, speed, width, height, color) {
   this.solver = new Solver();
   this.position = position;
   this.speed = speed;
   this.speedIntensity = 100;
   this.force = new Vector(0,0);
   this.mass = 1;
   this.width = width;
   this.height = height;
   this.color = color;
   this.fov = Math.PI/2;
}


Agent.prototype = {
    draw: function(context) {
    },

    setForce: function(force) {
        this.force = force;
    },

    update: function (dt) {

        this.solver.solverEulerCromer(this, dt);
    },
    isNeighbour: function(other, neighbourhoodRadius) {
        if (this.position.distance(other.position) < neighbourhoodRadius) {
            var positionVector = other.position.substract(this.position).normalize();
            var directionVector = this.speed.normalize();
            var angle = Math.acos(positionVector.dot(directionVector));
            return angle < this.fov;
        }
        return false;
    }
};








