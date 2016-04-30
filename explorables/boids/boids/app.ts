/// <reference path="References.ts" />
var engines = [];
window.onload = () => {
    createEngine('canvas0');
    createEngine('canvas1');
    requestAnimationFrame(draw);
};

function createEngine(id) {
    var el = document.getElementById(id);
    var canvas = document.createElement('canvas');
    canvas.id = "Canvas" + id;
    canvas.width = 400;
    canvas.height = 200;
    el.appendChild(canvas);
    var context = canvas.getContext("2d");

    engines.push(new Boids.BoidsEngine(context, 400, 200, 10, 3));
}

function draw() {
    for (var i = 0; i < engines.length; i++) {
        engines[i].draw();
    }
    requestAnimationFrame(draw);
}