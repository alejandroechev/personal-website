
var currentContext;
var width, height; 
var frameUpdateDeltaTime = 1.0 / 60.0;
var currentTime = 0;
var previousNUmberOfStepsPerFrame = 50;
var numberOfStepsPerFrame = 50;

var pendulum;

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

	document.getElementById("timeStepSlider").addEventListener("change", onTimeStepChanged, false);

	pendulum = new Pendulum(new Vector(width / 2, height / 6), 200, Math.PI/6,  '#88FF88');
	
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
		pendulum.update(stepSize);
		
	};
    
	pendulum.draw(currentContext);
	
    
	requestAnimationFrame(draw);

}


