/// <reference path="References.ts" />
var engines = [];
window.onload = function () {
    createEngine('noForce', 20, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    createEngine('separation', 20, 0, 7, 0, 0, 0, 50, 0, 0, 0);
    createEngine('cohesion', 20, 0, 7, 5, 0, 0, 50, 200, 0, 0);
    createEngine('alignment', 20, 0, 7, 5, 5, 0, 50, 200, 400, 0);
    createEngine('obstacle', 20, 3, 7, 5, 5, 20, 50, 200, 400, 80);
    requestAnimationFrame(draw);
};
function createEngine(id, numBoids, numObstacles, sepForce, cohesionForce, alignForce, obstacleForce, separationRadius, cohesionRadius, alignmentRadius, obstacleRadius) {
    var el = document.getElementById(id);
    var canvas = document.createElement('canvas');
    canvas.id = "Canvas" + id;
    canvas.width = 400;
    canvas.height = 200;
    el.appendChild(canvas);
    var context = canvas.getContext("2d");
    var params = {
        width: canvas.width,
        height: canvas.height,
        numberOfBoids: numBoids,
        numberOfObstacles: numObstacles,
        separationForceIntensity: sepForce,
        separationRadius: separationRadius,
        cohesionForceIntensity: cohesionForce,
        cohesionRadius: cohesionRadius,
        alignmentForceIntensity: alignForce,
        alignmentRadius: alignmentRadius,
        obstacleForceIntensity: obstacleForce,
        obstacleRadius: obstacleRadius
    };
    engines.push(new Boids.BoidsEngine(context, params));
}
function draw() {
    for (var i = 0; i < engines.length; i++) {
        engines[i].draw();
    }
    requestAnimationFrame(draw);
}
//# sourceMappingURL=app.js.map