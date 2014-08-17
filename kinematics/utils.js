function Spring(stiffnes, mass, pivot, position, velocity, color) {
    this.stiffness = stiffnes;
    this.mass = mass;
    this.position = position;
    this.initialPosition = position;
    this.velocity = velocity;
    this.initialVelocity = velocity;
    this.pivot = pivot;
    this.color = color;
    this.pivotSize = 5;
    this.bobSize = 15;
}

Spring.prototype = {
    draw: function (context) {
        context.beginPath();
        context.arc(this.pivot.x, this.pivot.y, this.pivotSize, 0, 2 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = 'white';
        context.stroke();

        var bobPosition = this.pivot.add(this.position);

        context.beginPath();
        context.moveTo(this.pivot.x, this.pivot.y);
        context.lineTo(bobPosition.x, bobPosition.y);
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.arc(bobPosition.x, bobPosition.y, this.bobSize, 0, 2 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
        context.fillStyle = this.color;
        context.fill();

    },
    updateExact: function (time) {
        var positionFactor = Math.cos(Math.sqrt(this.stiffness / this.mass) * time);
        var velocityFactor = Math.sin(Math.sqrt(this.stiffness / this.mass) * time) / (Math.sqrt(this.stiffness / this.mass));

        this.position = this.initialPosition.multiply(positionFactor).add(this.initialVelocity.multiply(velocityFactor));

    },
    //Solve position and velocity with Euler Method
    updateEuler: function (dt) {
        var acceleration = this.position.multiply(-(this.stiffness / this.mass));
        this.position = this.position.add(this.velocity.multiply(dt));
        this.velocity = this.velocity.add(acceleration.multiply(dt));
        
    },
    ///Euler-Cromer Time Step, position is updated with new velocity http://encinographic.blogspot.com/2013/05/simulation-class-euler-cromer-time-step.html
    updateEulerCromer: function (dt) {
        var acceleration = this.position.multiply(-(this.stiffness / this.mass));
        this.velocity = this.velocity.add(acceleration.multiply(dt));
        this.position = this.position.add(this.velocity.multiply(dt));

    },
    updateMidPoint: function (dt) {
        var acceleration = this.position.multiply(-(this.stiffness / this.mass));
        this.position = this.position.add(this.velocity.multiply(dt/2));
        this.velocity = this.velocity.add(acceleration.multiply(dt));
        this.position = this.position.add(this.velocity.multiply(dt/2));

    },
    //Solve Runge Kutta 4th Approximation
    updateRK4: function (dt) {

        var a1 = this.position.multiply(-(this.stiffness / this.mass));
        var v1 = this.velocity;

        var a2 = this.position.add(v1.multiply(dt/2)).multiply(-(this.stiffness / this.mass));
        var v2 = this.velocity.add(a1.multiply(dt / 2));

        var a3 = this.position.add(v2.multiply(dt / 2)).multiply(-(this.stiffness / this.mass));
        var v3 = this.velocity.add(a2.multiply(dt / 2));

        var a4 = this.position.add(v3.multiply(dt)).multiply(-(this.stiffness / this.mass));
        var v4 = this.velocity.add(a3.multiply(dt));

        var dt6 = dt / 6;
        var sumV = v1.add(v2.multiply(2).add(v3.multiply(2).add(v4)));
        var sumA = a1.add(a2.multiply(2).add(a3.multiply(2).add(a4)));

        this.position = this.position.add(sumV.multiply(dt6));
        this.velocity = this.velocity.add(sumA.multiply(dt6));
    },
};