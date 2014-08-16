
var currentContext;
var width, height; 
var frameUpdateDeltaTime = 1 / 60;

var fluid;

function Fluid(sizeX, sizeY, cellSizeX, cellSizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.cellSizeX = cellSizeX;
    this.cellSizeY = cellSizeY;
}


Fluid.prototype = {
    draw: function (context) {
        for (var i = 0; i < this.sizeX; i++) {
            for (var j = 0; j < this.sizeY; j++) {
                context.fillStyle = 'white';
                context.strokeStyle = 'black';
                context.lineWidth = 1;
                context.fillRect(this.cellSizeX * i, this.cellSizeY * j, this.cellSizeX, this.cellSizeY);
                context.strokeRect(this.cellSizeX * i, this.cellSizeY * j, this.cellSizeX, this.cellSizeY);
            }
        }
    },

    update: function (dt) {
        
    }
};

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
	//document.getElementById("showOverlayInput").addEventListener("change", onShowOverlayChanged, false);

    fluid = new Fluid(62, 62, 10, 10);

	requestAnimationFrame(draw);
}

function draw(){
	currentContext.fillStyle = '#222';
	currentContext.strokeStyle = 'white';
	currentContext.fillRect(0,0,width,height);
	currentContext.strokeRect(0,0,width,height);

	fluid.draw(currentContext);
	
	requestAnimationFrame(draw);

}
