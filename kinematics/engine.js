
var currentContext;
var width, height; 
var frameUpdateDeltaTime = 1.0 / 60.0;
var currentTime = 0;
var previousNUmberOfStepsPerFrame = 70;
var numberOfStepsPerFrame = 70;

var springEuler, springEulerCromer, springRK4, springExact, springMidPoint;

function getMousePos(evt) {
	var canvas = document.getElementById("display");
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function onTimeStepChanged(event)
{
	numberOfStepsPerFrame = 100 / event.target.value;
}


function load(canvas){
	width = canvas.width;
	height = canvas.height;
	currentContext = canvas.getContext("2d");

	//document.getElementById("timeStepSlider").addEventListener("change", onTimeStepChanged, false);

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
	
	previousNUmberOfStepsPerFrame = numberOfStepsPerFrame;
	var stepSize = frameUpdateDeltaTime / previousNUmberOfStepsPerFrame;
	for(var i = 0; i < previousNUmberOfStepsPerFrame; i++) {
		
		currentTime = currentTime + stepSize;
		springExact.updateExact(currentTime);
		springEuler.updateEuler(stepSize);
		springEulerCromer.updateEulerCromer(stepSize);
		springMidPoint.updateMidPoint(stepSize);
		springRK4.updateRK4(stepSize);
	};
    
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
