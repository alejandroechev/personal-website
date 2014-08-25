
var currentContext;
var width, height; 

var numberOfBoids = 100;
var numberOfObstacles = 5;
var numberOfPredators = 1;
var boids = [];
var obstacles = [];


var separationRadius = 60;
var separationForceIntensity = 7;
var alignmentRadius = 400;
var alignmentForceIntensity = 5;
var cohesionRadius = 700;
var cohesionForceIntensity = 5;
var obstacleRadius = 80;
var obstacleForceIntensity = 20;

var frameUpdateDeltaTime = 1/60;

var specialBoid = 50;
var showOverlay = false;

var drawBoid = function(context){
		context.fillStyle = this.color;
		context.strokeStyle = 'black';
		var normalizedSpeed = this.speed.normalize();
		var perpSpeed = new Vector(-normalizedSpeed.y, normalizedSpeed.x);
		var point1 = this.position.add(perpSpeed.multiply(this.width/2));
		var point2 = this.position.add(normalizedSpeed.multiply(this.height));
		var point3 = this.position.substract(perpSpeed.multiply(this.width/2));
		context.beginPath();
		context.moveTo(point1.x,point1.y);
    	context.lineTo(point2.x,point2.y);
    	context.lineTo(point3.x,point3.y);
    	context.lineWidth = 1;
    	context.fill();
    	context.stroke();
	}; 

var drawObstacle = function(context){
		context.fillStyle = this.color;
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.fillRect(this.position.x, this.position.y, this.width, this.height);
		context.strokeRect(this.position.x, this.position.y, this.width, this.height);
	}; 	
	
function addObstacle(x, y)
{
		var position = new Vector(x,y);
		var speed = new Vector(0,0);
		var obstacle = new Agent(position, speed, 25, 25, '#99ccff');
		obstacle.draw = drawObstacle;
		obstacles.push(obstacle);
}

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
	addObstacle(pos.x, pos.y);
}

function onShowOverlayChanged(event)
{
	showOverlay = event.target.checked;
}

function onSeparationRadiusChanged(event)
{
	separationRadius = event.target.value;
}

function onSeparationForceChanged(event)
{
	separationForceIntensity = event.target.value;
}

function onAlignmentRadiusChanged(event)
{
	alignmentRadius = event.target.value;
}

function onAlignmentForceChanged(event)
{
	alignmentForceIntensity = event.target.value;
}

function onCohesionRadiusChanged(event)
{
	cohesionRadius = event.target.value;
}

function onCohesionForceChanged(event)
{
	cohesionForceIntensity = event.target.value;
}

function onObstacleRadiusChanged(event)
{
	obstacleRadius = event.target.value;
}

function onObstacleForceChanged(event)
{
	obstacleForceIntensity = event.target.value;
}


function load(canvas){
	width = canvas.width;
	height = canvas.height;
	currentContext = canvas.getContext("2d");
	for (var i = 0; i < numberOfBoids; i++) {
		var position = new Vector(0.1*width + Math.random()*width*0.8, 0.1*height + Math.random()*height*0.8);
		var speed = new Vector(2*Math.random()-1, 2*Math.random()-1);
		var boid = new Agent(position, speed, 8, 10, '#ffb266');
		boid.tag = Math.random() < 0.5 ? 0 : 1;
		if(boid.tag == 1)
			boid.color = '#99ccff';
		boid.draw = drawBoid;
		boids.push(boid);
	};
	

	canvas.addEventListener("mousedown", onMouseClicked, false);
	document.getElementById("showOverlayInput").addEventListener("change", onShowOverlayChanged, false);
	document.getElementById("separationRadiusInput").addEventListener("change", onSeparationRadiusChanged, false);
	document.getElementById("separationForceInput").addEventListener("change", onSeparationForceChanged, false);
	document.getElementById("alignmentRadiusInput").addEventListener("change", onAlignmentRadiusChanged, false);
	document.getElementById("alignmentForceInput").addEventListener("change", onAlignmentForceChanged, false);
	document.getElementById("cohesionRadiusInput").addEventListener("change", onCohesionRadiusChanged, false);
	document.getElementById("cohesionForceInput").addEventListener("change", onCohesionForceChanged, false);
	document.getElementById("obstacleRadiusInput").addEventListener("change", onObstacleRadiusChanged, false);
	document.getElementById("obstacleForceInput").addEventListener("change", onObstacleForceChanged, false);
	
	requestAnimationFrame(draw);
}

function draw(){
	currentContext.fillStyle = '#222';
	currentContext.strokeStyle = 'white';
	currentContext.fillRect(0,0,width,height);
	currentContext.strokeRect(0,0,width,height);

	for (var i = 0; i < boids.length; i++) {
		var separationForce = getSeparationForce(boids[i], boids, separationRadius);
		separationForce = separationForce.multiply(separationForceIntensity);
		var alignmentForce = getAlignmentForce(boids[i], boids, alignmentRadius);
		alignmentForce = alignmentForce.multiply(alignmentForceIntensity);
		var cohesionForce = getCohesionForce(boids[i], boids, cohesionRadius);
		cohesionForce = cohesionForce.multiply(cohesionForceIntensity);
		var obstacleForce = getSeparationForce(boids[i], obstacles, obstacleRadius);
		obstacleForce = obstacleForce.multiply(obstacleForceIntensity);
		
		boids[i].setForce(separationForce.add(alignmentForce).add(cohesionForce).add(obstacleForce));
		boids[i].update(frameUpdateDeltaTime);
		
		if(boids[i].position.x < 0)
			boids[i].position.x = width;
		if(boids[i].position.x > width)
			boids[i].position.x = 0;
		if(boids[i].position.y < 0)
			boids[i].position.y = height;
		if(boids[i].position.y > height)
			boids[i].position.y = 0;
		
		//updateTag(boids[i], boids, separationRadius)
		boids[i].draw(currentContext);

		if(i == specialBoid && showOverlay)
		{
			var forces = [separationForce, alignmentForce,cohesionForce, obstacleForce];
			var radiuses = [separationRadius, alignmentRadius, cohesionRadius, obstacleRadius];
			drawBoidOverlay(boids[i], forces, radiuses);
		}
	}
	for (var i = 0; i < obstacles.length; i++) {
		obstacles[i].draw(currentContext);
	}
	requestAnimationFrame(draw);

}

function drawBoidOverlay(boid, forces, radiuses)
{
	var colors = ['#88FF88', '#FF8888','#FF88FF','#88FFFF'];
	for (var i = 0; i < radiuses.length; i++) {
		currentContext.beginPath();
      	currentContext.arc(boid.position.x, boid.position.y, radiuses[i], 0, 2 * Math.PI, false);
      	currentContext.lineWidth = 2;
      	currentContext.strokeStyle = colors[i];
      	currentContext.stroke();

      	var forcePoint = boid.position.add(forces[i].multiply(10));
      	currentContext.beginPath();
      	currentContext.moveTo(boid.position.x, boid.position.y);
      	currentContext.lineTo(forcePoint.x, forcePoint.y);
      	currentContext.stroke();
		
	};
}

function updateTag(agent, agents, radius)
{
	var myTagNeighbours = 0;
	var otherTagNeighbours = 0;
	
	var myTag = agent.tag;
	var otherTag = agent.tag == 0 ? 1 : 0;

	var otherTagColor = agent.tag == 0 ? '#99ccff' : '#ffb266'; 
	for (var i = 0; i < agents.length; i++) 
	{
		if(agents[i] != agent && agent.isNeighbourWithTag(agents[i], radius, myTag))
		{
			myTagNeighbours = myTagNeighbours + 1;
		}
		if(agents[i] != agent && agent.isNeighbourWithTag(agents[i], radius, otherTag))
		{
			otherTagNeighbours = otherTagNeighbours + 1;	
		}
	}

	if(otherTagNeighbours > myTagNeighbours)
	{
		agent.tag = otherTag;
		agent.color = otherTagColor;
	}
	else if(myTagNeighbours == 0)
		agent.tag = otherTag;


}

function getSeparationForce(agent, agents, radius)
{
	var accumulatedSeparation = new Vector(0,0);
	for (var i = 0; i < agents.length; i++) {
		if(agents[i] != agent && agent.isNeighbour(agents[i], radius))
		{
			accumulatedSeparation = accumulatedSeparation.add(agent.position.substract(agents[i].position));
		}
	}
	return accumulatedSeparation.normalize();
}

function getAlignmentForce(agent, agents, radius)
{
	var averageAlignment = new Vector(0,0);
	var numberOfNeighbours = 0;
	for (var i = 0; i < agents.length; i++) {
		if(agents[i] != agent && agent.isNeighbour(agents[i], radius))
		{
			averageAlignment = averageAlignment.add(agents[i].speed);
			numberOfNeighbours+=1;
		}
	}
	if(numberOfNeighbours > 0)
		averageAlignment = averageAlignment.multiply(1/numberOfNeighbours);

	return averageAlignment.substract(agent.speed).normalize();
}

function getCohesionForce(agent, agents, radius)
{
	var averagePosition = new Vector(0,0);
	var numberOfNeighbours = 0;
	for (var i = 0; i < agents.length; i++) {
		if(agents[i] != agent && agent.isNeighbour(agents[i], radius))
		{
			averagePosition = averagePosition.add(agents[i].position);
			numberOfNeighbours+=1;
		}
	}
	if(numberOfNeighbours > 0)
		averagePosition = averagePosition.multiply(1/numberOfNeighbours);

	return averagePosition.substract(agent.position).normalize();
}