function CompundPendulum(pivot, length1, theta1, length2, theta2, color1, color2)
{
    this.pendulum1 = new Pendulum(pivot,length1, theta1, color);
    this.pendulum2 = new Pendulum(this.pendulum1.position, lenght2, theta2, color2);
}

Pendulum.prototype = {
    draw: function (context) {
        
    },
    update: function (dt) {
    },

}

function Pendulum(pivot, length, theta, color) {
    this.pivot = pivot;
    this.position = this.pivot.add(new Vector(length * Math.cos(theta + Math.PI/2), length * Math.sin(theta + Math.PI/2)));
    this.angularvelocity = 0;
    this.length = length;
    this.theta = theta;
    this.color = color;
    this.pivotSize = 2;
    this.bobSize = 5;
    this.gravity = 98;
}

Pendulum.prototype = {
    draw: function (context) {
        context.beginPath();
        context.arc(this.pivot.x, this.pivot.y, this.pivotSize, 0, 2 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = 'white';
        context.stroke();

        var bobPosition = this.position;

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


    update: function (dt) {
        var acceleration =  -Math.sin(this.theta) * this.gravity / this.length;
        this.angularvelocity = this.angularvelocity + acceleration * dt;
        this.theta = this.theta + this.angularvelocity * dt;
        this.position = this.pivot.add(new Vector(this.length* Math.cos(this.theta + Math.PI/2), this.length* Math.sin(this.theta + Math.PI/2)));
    },
    
};