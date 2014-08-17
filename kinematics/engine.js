
var currentContext;
var width, height; 
var frameUpdateDeltaTime = 1.0 / 60.0;
var currentTime = 0;

var springEuler, springEulerCromer, springRK4, springExact, springMidPoint;

function getMousePos(evt) {
	var canvas = document.getElementById("display");
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function onMouseClicked(event)
{
	var pos = getMousePos(event);
}


function load(canvas){
	width = canvas.width;
	height = canvas.height;
	currentContext = canvas.getContext("2d");

	canvas.addEventListener("mousedown", onMouseClicked, false);

	springExact = new Spring(5, 0.5, new Vector(width / 2, height / 6), new Vector(100, 0), new Vector(0, 0), '#88FF88');
	springEuler = new Spring(5, 0.5, new Vector(width / 2, 2 * height / 6), new Vector(100, 0), new Vector(0, 0), '#FF8888');
	springMidPoint = new Spring(5, 0.5, new Vector(width / 2, 3 * height / 6), new Vector(100, 0), new Vector(0, 0), '#FF88FF');
	springEulerCromer = new Spring(5, 0.5, new Vector(width / 2, 4 * height / 6), new Vector(100, 0), new Vector(0, 0), '#FFFF88');
	springRK4 = new Spring(5, 0.5, new Vector(width / 2, 5 * height / 6), new Vector(100, 0), new Vector(0, 0), '#88FFFF');

	requestAnimationFrame(draw);
}

function draw(){
	currentContext.fillStyle = '#222';
	currentContext.strokeStyle = 'white';
	currentContext.fillRect(0,0,width,height);
	currentContext.strokeRect(0,0,width,height);

    currentTime = currentTime + frameUpdateDeltaTime;
	springExact.updateExact(currentTime);
	springEuler.updateEuler(frameUpdateDeltaTime);
	springEulerCromer.updateEulerCromer(frameUpdateDeltaTime);
	springMidPoint.updateMidPoint(frameUpdateDeltaTime);
	springRK4.updateRK4(frameUpdateDeltaTime);

	springExact.draw(currentContext);
	springEuler.draw(currentContext);
	springEulerCromer.draw(currentContext);
	springMidPoint.draw(currentContext);
	springRK4.draw(currentContext);

    drawOverlay(currentContext);
	
	requestAnimationFrame(draw);

}

function drawOverlay(context) {
    var bobPosition = springExact.pivot.add(springExact.position);
    context.beginPath();
    context.setLineDash([5]);
    context.moveTo(bobPosition.x, 0);
    context.lineTo(bobPosition.x, height);
    context.strokeStyle = 'white';
    context.stroke();
    context.setLineDash([0]);
}
