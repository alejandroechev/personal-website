
var currentContext;
var width, height; 

var grid;
var tileSize = 50;
var numRows = 50;
var numColumns = 150;
var numberOfColors = 3;
 
var colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'brown', 'orange'];

var xOrigin = 50;
var yOrigin = 50;

var allNeighbours = function(tile)
{
	var neighbours = [];
	var minI = Math.max(0,tile.i-1);
	var maxI = Math.min(numRows-1,tile.i+1);
	var minJ = Math.max(0,tile.j-1);
	var maxJ = Math.min(numColumns-1,tile.j+1);
	for (var i = minI; i <= maxI; i++) {
		for (var j = minJ; j <= maxJ; j++) {
			if((i!= tile.i || j!=tile.j) && tile.color == grid[i][j].color)
				neighbours.push(grid[i][j]);
		}
	};
	return neighbours;
};

var fourNeighbours = function(tile)
{
	var neighbours = [];
	if(tile.i-1 >= 0 && tile.color == grid[tile.i-1][tile.j].color)
		neighbours.push(grid[tile.i-1][tile.j]);
	if(tile.i+1 < numRows && tile.color == grid[tile.i+1][tile.j].color)
		neighbours.push(grid[tile.i+1][tile.j]);
	if(tile.j-1 >= 0 && tile.color == grid[tile.i][tile.j-1].color)
		neighbours.push(grid[tile.i][tile.j-1]);
	if(tile.j+1 < numColumns && tile.color == grid[tile.i][tile.j+1].color)
		neighbours.push(grid[tile.i][tile.j+1]);

	return neighbours;
};

var neighbourFunctionIndex = 0;
var neighbourFunctionArray = [fourNeighbours, allNeighbours];


function getMousePos(evt) {
	var canvas = document.getElementById("display");
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function getGridIndexesFromMouse(pos){
	var i = Math.floor((pos.y - yOrigin)/tileSize);
	var j = Math.floor((pos.x - xOrigin)/tileSize);
	return {
		i: i,
		j: j
	};
}

function positionToIndex(i,j)
{
	return i + numRows*j;
}

function onMouseClicked(event)
{
	var pos = getMousePos(event);
	var indexes = getGridIndexesFromMouse(pos);
	var visitedArray ={};
	updateGrid(grid[indexes.i][indexes.j], visitedArray);
	readjustGrid();
	draw();
}

function updateGrid(tile, visitedArray)
{
	var neighbours = neighbourFunctionArray[neighbourFunctionIndex](tile);
	grid[tile.i][tile.j].color = 'black';
	visitedArray[positionToIndex(tile.i,tile.j)] = true;
	for (var i = 0; i < neighbours.length; i++) {
			//neighbours[i].color = 'black';
		if(visitedArray[positionToIndex(neighbours[i].i, neighbours[i].j)] != true)
			updateGrid(neighbours[i], visitedArray);
	};
}

function getXYforIJ(i,j)
{
	return{
		x: j*tileSize + xOrigin,
		y: i*tileSize + yOrigin
	}
}

function readjustGrid()
{
	//update rows
	var emptyColumns = {};
	for (var j = 0; j < numColumns; j++) {
		var newColumnColors = [];
		for (var i = 0; i <numRows; i++) {
			if(grid[numRows - i - 1][j].color != 'black')
			{
				newColumnColors.push(grid[numRows - i - 1][j].color);
			}		
		}

		if(newColumnColors.length == 0)
			emptyColumns[j] = true;

		for (var i = 0; i < newColumnColors.length; i++) {
			var xy = getXYforIJ(numRows - i - 1,j);
			grid[numRows - i - 1][j] = new Tile(xy.x,xy.y,numRows - i - 1,j,newColumnColors[i]);

		};
		for (var i = newColumnColors.length; i < numRows; i++) {
			var xy = getXYforIJ(numRows - i - 1,j);
			grid[numRows - i - 1][j] = new Tile(xy.x,xy.y,numRows - i - 1,j,'black');
		};
	}

	//update columns
	for (var i = 0; i <numRows; i++) {
		var newRowColors = [];
		for (var j = 0; j < numColumns; j++) {
			if(!(j in emptyColumns))
			{
				newRowColors.push(grid[i][j].color);
			}
		}

		for (var j = 0; j < newRowColors.length; j++) {
			var xy = getXYforIJ(i,j);
			grid[i][j] = new Tile(xy.x,xy.y,i,j,newRowColors[j]);
		};

		for (var j = newRowColors.length; j < numColumns; j++) {
			var xy = getXYforIJ(i,j);
			grid[i][j] = new Tile(xy.x,xy.y,i,j,'black');
		};
	}
}

function load(canvas){
	width = canvas.width;
	height = canvas.height;
	numRows = Math.floor((height - 2*yOrigin) / tileSize);
	numColumns = Math.floor((width - 2*xOrigin) / tileSize);
	currentContext = canvas.getContext("2d");
	
	canvas.addEventListener("mousedown", onMouseClicked, false);
	//document.getElementById("showOverlayInput").addEventListener("change", onShowOverlayChanged, false);
	
	grid = new Array(numRows);
	for (var i = 0; i < grid.length; i++) {
		grid[i] = new Array(numColumns);
	}; 

			
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var randColorIndex = Math.floor((Math.random() * numberOfColors));
			var xy = getXYforIJ(i,j);
			grid[i][j] = new Tile(xy.x,xy.y,i,j,colors[randColorIndex]);
		}
	};

	requestAnimationFrame(draw);
}

function draw(){
	currentContext.fillStyle = '#222';
	currentContext.strokeStyle = 'white';
	currentContext.fillRect(0,0,width,height);
	currentContext.strokeRect(0,0,width,height);

	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			grid[i][j].draw(currentContext);
		}
	}
	
	//requestAnimationFrame(draw);

}


function Tile(x,y,i,j,color){
   this.x = x;
   this.y = y;
   this.i = i;
   this.j = j;
   this.color = color;
}

Tile.prototype = {
    draw: function (context) {
        context.fillStyle = this.color;
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.fillRect(this.x, this.y, tileSize, tileSize);
		context.strokeRect(this.x, this.y, tileSize, tileSize);

    },
    clone: function(){
    	return new Tile(this.x, this.y, this.i, this.j, this.color);
    }

};



