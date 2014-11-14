
var currentContext;
var width, height; 

var grid;
var tileWidth = 15;
var tileHeight = 15;
var numRows = 25;
var numColumns = 40;
var numberOfColors = 3;
 
var colors = ['#d0e8de', '#cf808b', '#57374d', '#dec4a6', '#999999'];

var xOrigin = 0;
var yOrigin = 0;

var deltaI, deltaJ;


function checkBounds(i,j)
{
	if(i < 0) return false;
	if(j < 0) return false;
	if(i >= numRows) return false;
	if(j >= numColumns) return false;
	return true;
}

var checkNeighbours = function(tile)
{
	var neighbours = [];
	for (var i = 0; i < deltaI.length; i++) {
		var dI = deltaI[i];
		var dJ = deltaJ[i];
		if(checkBounds(tile.i + dI, tile.j + dJ))
		{
			var neighbour = grid[tile.i + dI][tile.j + dJ];
			if(neighbour.color == tile.color)
				neighbours.push(neighbour);
		}
	};

	return neighbours;
};



function getMousePos(evt) {
	var canvas = document.getElementById("display");
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function getGridIndexesFromMouse(pos){
	var i = Math.floor((pos.y - yOrigin)/tileHeight);
	var j = Math.floor((pos.x - xOrigin)/tileWidth);
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
	exportGridAsText();
	draw();
}

function onColorSliderChanged(event)
{
	numberOfColors = Math.floor(event.target.value);
}

function onRowsSliderChanged(event)
{
	numRows = Math.floor(event.target.value);
}

function onColumnsSliderChanged(event)
{
	numColumns = Math.floor(event.target.value);
}

function onUpdateClicked(event)
{
	update();
}



function exportGridAsText()
{
	document.getElementById('textGrid').value = (toString(grid));
}

function updateGrid(tile, visitedArray)
{
	var neighbours = checkNeighbours(tile);
	grid[tile.i][tile.j].color = 'black';
	grid[tile.i][tile.j].colorIndex = -1;
	visitedArray[positionToIndex(tile.i,tile.j)] = true;
	for (var i = 0; i < neighbours.length; i++) {
		if(!visitedArray[positionToIndex(neighbours[i].i, neighbours[i].j)])
			updateGrid(neighbours[i], visitedArray);
	};
}

function getXYforIJ(i,j)
{
	return{
		x: j*tileWidth + xOrigin,
		y: i*tileHeight + yOrigin
	}
}

function readjustGrid()
{
	//update rows
	var emptyColumns = [];
	for (var j = 0; j < numColumns; j++) {
		emptyColumns.push(false);
		var newColumnColors = [];
		for (var i = 0; i <numRows; i++) {
			if(grid[numRows - i - 1][j].color != 'black')
			{
				newColumnColors.push(grid[numRows - i - 1][j].colorIndex);
			}		
		}

		if(newColumnColors.length == 0)
			emptyColumns[j] = true;

		for (var i = 0; i < newColumnColors.length; i++) {
			var xy = getXYforIJ(numRows - i - 1,j);
			grid[numRows - i - 1][j] = new Tile(xy.x,xy.y,numRows - i - 1,j,colors[newColumnColors[i]],newColumnColors[i]);

		};
		for (var i = newColumnColors.length; i < numRows; i++) {
			var xy = getXYforIJ(numRows - i - 1,j);
			grid[numRows - i - 1][j] = new Tile(xy.x,xy.y,numRows - i - 1,j,'black',-1);
		};
	}

	//update columns
	for (var i = 0; i <numRows; i++) {
		var newRowColors = [];
		for (var j = 0; j < numColumns; j++) {
			
			if(!(emptyColumns[j]))
			{
				newRowColors.push(grid[i][j].colorIndex);
			}
		}

		for (var j = 0; j < newRowColors.length; j++) {
			var xy = getXYforIJ(i,j);
			grid[i][j] = new Tile(xy.x,xy.y,i,j,colors[newRowColors[j]],newRowColors[j]);
		};

		for (var j = newRowColors.length; j < numColumns; j++) {
			var xy = getXYforIJ(i,j);
			grid[i][j] = new Tile(xy.x,xy.y,i,j,'black',-1);
		};
	}
}

function randNumber(max)
{
	return Math.floor(max*Math.random() + 1);
}

function update(){

	tileWidth = width / numColumns;
	tileHeight = height / numRows;

	deltaI = [-1,1,0,0];
	deltaJ = [0,0,-1,1];
	

	grid = new Array(numRows);
	for (var i = 0; i < grid.length; i++) {
		grid[i] = new Array(numColumns);
	}; 

			
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var randColorIndex = Math.floor((Math.random() * numberOfColors));
			var xy = getXYforIJ(i,j);
			grid[i][j] = new Tile(xy.x,xy.y,i,j,colors[randColorIndex],randColorIndex);
		}
	};


	exportGridAsText();
	requestAnimationFrame(draw);
}

function load(canvas){
	width = canvas.width;
	height = canvas.height;
	
	currentContext = canvas.getContext("2d");
	
	canvas.addEventListener("mousedown", onMouseClicked, false);
	document.getElementById("colorSlider").addEventListener("change", onColorSliderChanged, false);
	document.getElementById("rowsSlider").addEventListener("change", onRowsSliderChanged, false);
	document.getElementById("columnsSlider").addEventListener("change", onColumnsSliderChanged, false);
	document.getElementById("updateButton").addEventListener("click", onUpdateClicked, false);
	
	update();
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
	

}

function toString(grid)
{
	var string = "";
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			if(grid[i][j].color =='black')
				string = string + ' ';
			else
				string = string + '*';
		}
		string = string + '\n';
	}
	return string;
}


function Tile(x,y,i,j,color,colorIndex){
   this.x = x;
   this.y = y;
   this.i = i;
   this.j = j;
   this.color = color;
   this.colorIndex = colorIndex;
}

Tile.prototype = {
    draw: function (context) {
        context.fillStyle = this.color;
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.fillRect(this.x, this.y, tileWidth, tileHeight);
		context.strokeRect(this.x, this.y, tileWidth, tileHeight);

    },
    clone: function(){
    	return new Tile(this.x, this.y, this.i, this.j, this.color, this.colorIndex );
    }

};



