////////////////////////////////////////////////////////////////////////////////
//Document Setup
var canvas = document.querySelector('canvas');
var inter = false
var included = []
var counter_included = []
var cycle_edges = {}
var counter_cycle_edges = {}
var selectedarr = [];



var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
///c.translate((window.innerWidth)/2,(window.innerHeight)/2)

var Graph_STR = document.getElementsByClassName("div1")[0].getAttribute("data-graph");
var fixed = Graph_STR.replace(/[']/g,"\"");
var JSON_OBj = JSON.parse(fixed);

var a = (JSON_OBj["nodes"][1]["x_pos"])**2 + (JSON_OBj["nodes"][1]["y_pos"])**2
var global_radius = canvas.height/4
var scale = Math.sqrt(a)/global_radius
////////////////////////////////////////////////////////////////////////////////
//Click Events
var mouse = {
		x: 0,
		y: 0
	}

window.addEventListener('click',
		function(event){
		mouse.x = event.x
		mouse.y = event.y
		}
)

function clearm (){
	mouse.x = 0
	mouse.y = 0
}
////////////////////////////////////////////////////////////////////////////////
//Drag interaction
var x_new = 0;
var y_new = 0;
var isDragging = false;
var isDraggedId = null;

window.addEventListener('mousedown',
		function(event){
			x_new = event.x;
		  y_new = event.y;
			isDragging = true;
		}
);

window.addEventListener('mousemove',
		function(event){
			if(isDragging === true && isDraggedId !== null){
				x_new = event.x;
				y_new = event.y;
				nodeArray[isDraggedId].updatePos(x_new, y_new)
				for (var i = 0; i < edgeArray.length; i++){
					if (edgeArray[i].from === isDraggedId && edgeArray[i].to === isDraggedId){
						edgeArray[i].updateEdgeStart(x_new,y_new)
						edgeArray[i].updateEdgeEnd(x_new,y_new)
					}

					if (edgeArray[i].from === isDraggedId){
						edgeArray[i].updateEdgeStart(x_new,y_new)
					}else if (edgeArray[i].to === isDraggedId){
						edgeArray[i].updateEdgeEnd(x_new,y_new)
					}

				}

			}
		}
);

window.addEventListener('mouseup',
		function(event){
			x_new = 0;
			y_new = 0;
			isDragging = false;
			isDraggedId = null;
		}
);


////////////////////////////////////////////////////////////////////////////////
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function Mix(){
	mix();
}

function Scramble(){
for (var i =0; i<500; i++){
	var scram_arr = []
	var k = getRndInteger(2,JSON_OBj["nodes"].length)
	for (var j = 0; j < (k); j++){
		var m = getRndInteger(0,(JSON_OBj["nodes"].length)-1)
		if (scram_arr.includes(m) == false){
			scram_arr.push(JSON_OBj["nodes"][m]["id"])
		}

  }
	check = Cyclecheck(scram_arr)
	if (check == true){
		var n = (Math.random()).toFixed(2)
		console.log(cycle_edges);
		console.log(n);
		for (var key in cycle_edges){
			id = cycle_edges[key];
			edgeArray[id].changeweight(n)
		}
		for (var key in counter_cycle_edges){
			id = counter_cycle_edges[key];
		  edgeArray[id].changeweight(-n)
		}
		}
	}

		included = []
		counter_included = []
		cycle_edges = {}
		counter_cycle_edges = {}
		scram_arr = []
	}

////////////////////////////////////////////////////////////////////////////////
function Cyclecheck(arr) {
	for (var i = 0; i < arr.length; i++){
		included.push(false)
		counter_included.push(false)
	}
	for (var i =0; i< arr.length; i++){
		if (i == (arr.length-1)){
			var edgecan = [arr[i],arr[0]];
			if (arr.length == 2){
				var counter_edgecan = [arr[i],arr[i]];
			}else {
				var counter_edgecan = [arr[0],arr[i]];
			}
		}else {
			var edgecan = [arr[i],arr[i+1]];
			if (arr.length == 2){
				var counter_edgecan = [arr[i],arr[i]];
			}else {
				var counter_edgecan = [arr[i+1],arr[i]];
			}

		}
		for (var j = 0; j < JSON_OBj["edges"].length; j++){
			var edge = [JSON_OBj["edges"][j]["from"], JSON_OBj["edges"][j]["to"]]
			if (edge[0] == edgecan[0] && edge[1] == edgecan[1]){
				included[i] = true;
				cycle_edges[edgecan] = j
			}
		}
		for (var j = 0; j < JSON_OBj["edges"].length; j++){
			var edge = [JSON_OBj["edges"][j]["from"], JSON_OBj["edges"][j]["to"]]
			if (edge[0] == counter_edgecan[0] && edge[1] == counter_edgecan[1]){
				counter_included[i] = true;
				counter_cycle_edges[counter_edgecan] = j
			}
		}
	}
	let checker = arr => arr.every(Boolean);

	if (checker(included) == true && checker(counter_included) == true){
		return true
	}else {
		return false
	}
	}
///////////////////////////////////////////////////////////////////////////////

function interaction (){
	check = Cyclecheck(selectedarr)
	if (check == true){
		for (var i = 0; i < selectedarr.length; i++){
			nodeArray[selectedarr[i]].changecol("green");
			inter = true}
	}else if (check == false){
		alert("Invalid Cycle")
		endinteraction()
	}
}
///////////////////////////////////////////////////////////////////////////////
window.addEventListener('wheel', function(event) {

	if (inter == true){
		for (var key in cycle_edges){
			id = cycle_edges[key];
			if (event.deltaY < 0){
				edgeArray[id].changeweight(0.01)
			}else if (event.deltaY > 0){
				edgeArray[id].changeweight(-0.01)
			}

		}
		for (var key in counter_cycle_edges){
			id = counter_cycle_edges[key];
			if (event.deltaY < 0){
				edgeArray[id].changeweight(-0.01)
			}else if (event.deltaY > 0){
				edgeArray[id].changeweight(0.01)
			}
		}
	}
	}
)
///////////////////////////////////////////////////////////////////////////////
function endinteraction() {

	for (var i = 0; i < selectedarr.length; i++){
		nodeArray[selectedarr[i]].changecol("black");
	}
	var winarry = [];
	for (var i = 0; i < edgeArray.length; i++){
		w = edgeArray[i].weight
		if (w >= 0){
			winarry.push(true);
		}else if (w < 0){
			winarry.push(false)
		}
	}
		let checker = arr => arr.every(Boolean);
		if (checker(winarry) == true){
			alert("Congrats on Completing the Level. Refresh the page to play again or return to the home page for another Level.")
		}
	inter = false;
	selectedarr = [];
	included = []
	counter_included = []
	cycle_edges = {}
	counter_cycle_edges = {}
}
///////////////////////////////////////////////////////////////////////////////
function reset(){
	for (var i = 0; i < edgeArray.length; i++){
		edgeArray[i].resetweight()
	}
}
///////////////////////////////////////////////////////////////////////////////
function button(x,y,w,h,buttontext,func) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
  this.text = buttontext;

	this.draw = function(){
		c.beginPath();
		c.strokeStyle = "black";
		c.lineWidth = 2;
		c.rect(this.x,this.y,this.width,this.height);
		c.fillStyle = "black";
		c.textAlign = "start";
		c.textBaseline = "alphabetic";
		c.fillText(this.text, 1.05*this.x, (this.y+ 0.75*(this.height)));
		c.stroke();
	}
	this.update = function(){
		if (mouse.x < (this.x + this.width) && mouse.x > this.x && mouse.y < (this.y + this.height) && mouse.y > this.y){
			func();
			clearm();
		}
		this.draw();
	}
}
///////////////////////////////////////////////////////////////////////////////
function arrayRemove(arr, value) {
	return arr.filter(function(ele){ return ele != value; });
}

function Node(x,y,id) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.radius = 20; //radius of the nodes
	this.colour = 'black'
	var bin = this.id
	this.draw = function() {
		c.beginPath();
	  c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
	  c.strokeStyle = this.colour;
		c.lineWidth = 10;
	  c.stroke();
	  c.fillStyle = "white";
	  c.fill();
		c.font = "30px Arial";
		c.fillStyle = "black";
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.fillText(bin,this.x,this.y);
	}

	this.update = function(){
	var dist = Math.sqrt((this.x - mouse.x)**2+(this.y - mouse.y)**2)

	if (dist < this.radius && this.colour == 'black'){
		this.colour = 'red'
		clearm()
		selectedarr.push(this.id)
	} else if (dist < this.radius && this.colour == 'red'){
		this.colour = 'black'
		clearm()
		selectedarr = arrayRemove(selectedarr,this.id)
	}

	var dist2 = Math.sqrt((this.x - x_new)**2+(this.y - y_new)**2)

	if (dist2 < this.radius){
		isDraggedId = this.id
	}
		this.draw()
	}
	this.changecol = function(colour){
		this.colour = colour
	}
	this.updatePos = function(new_x,new_y){
		this.x = new_x;
		this.y = new_y;
	}
}
///////////////////////////////////////////////////////////////////////////////
function drawArrowhead(context, from, to, radius) {
	var x_center = to.x;
	var y_center = to.y;

	var angle;
	var x;
	var y;

	context.beginPath();

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

	context.fill();
}
function Edge(x_1, y_1, x_2, y_2,weight,from,to){
	this.from = from;
	this.to= to;

	this.x_1 = x_1;
	this.y_1 = y_1;
	this.x_2 = x_2;
	this.y_2 = y_2;

	this.weight = weight
	this.init_weigth = weight

	this.draw = function(){
		this.x_m = (this.x_1 + this.x_2) /2
		this.y_m = (this.y_1 + this.y_2) /2
		this.scl = 0.1 //controls the curviness of the edges
		this.c_x = this.x_m + this.scl*(this.y_2-this.y_1)
		this.c_y = this.y_m - this.scl*(this.x_2-this.x_1)

		this.edge_colour = 'black'
		this.k = 1.5 //controls the positioning of the self loops text
		this.r = 35 //radius of the self loops
		this.x_text = this.k * (this.x_1 - (canvas.width)/2) +(canvas.width)/2
		this.y_text = this.k * (this.y_1 - (canvas.height)/2) +(canvas.height)/2


		if (this.x_1 == this.x_2 && this.y_1 == this.y_2){
			this.m = (this.y_1 - (canvas.height/2))/(this.x_1 - (canvas.width/2))
			this.d = 30

			c.beginPath();
			if ((this.x_1 - (canvas.width/2)) > 0 && (this.y_1 - (canvas.height/2)) > 0){

				this.x_s = this.x_1 + (this.d)/(Math.sqrt(1+(this.m)**2))
				this.y_s = this.y_1 + (this.d*this.m)/(Math.sqrt(1+(this.m)**2))
				c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
		   	c.strokeStyle = this.edge_colour;
				c.lineWidth = 2;
		   	c.stroke();
			}else if ((this.x_1 - (canvas.width/2)) > 0 && (this.y_1 - (canvas.height/2)) < 0){

				this.x_s = this.x_1 - (this.d)/(Math.sqrt(1+(this.m)**2))
				this.y_s = this.y_1 + (this.d*this.m)/(Math.sqrt(1+(this.m)**2))
				c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
		   	c.strokeStyle = this.edge_colour;
				c.lineWidth = 2;
		   	c.stroke();
			}else if ((this.x_1 - (canvas.width/2)) < 0 && (this.y_1 - (canvas.height/2)) > 0){

				this.x_s = this.x_1 + (this.d)/(Math.sqrt(1+(this.m)**2))
				this.y_s = this.y_1 - (this.d*this.m)/(Math.sqrt(1+(this.m)**2))
				c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
		   	c.strokeStyle = this.edge_colour;
				c.lineWidth = 2;
		   	c.stroke();
			}else if ((this.x_1 - (canvas.width/2)) < 0 && (this.y_1 - (canvas.height/2)) < 0){
				this.x_s = this.x_1 - (this.d)/(Math.sqrt(1+(this.m)**2))
				this.y_s = this.y_1 - (this.d*this.m)/(Math.sqrt(1+(this.m)**2))
				c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
		   	c.strokeStyle = this.edge_colour;
				c.lineWidth = 2;
		   	c.stroke();
			}



	   	c.font = "30px Arial";
			c.fillStyle = "black";
			c.textAlign = "center";
			c.textBaseline = "middle";
			if (this.weight != 0){
				c.fillText(this.weight,this.x_text,this.y_text); //1.25 * (this.x_1 - (canvas.width)/2) +(canvas.width)/2, 1.25 * (this.y_1 - (canvas.height)/2) +(canvas.height)/2);
			}

		}else{
			c.beginPath();
	   	c.moveTo(this.x_1,this.y_1);
	   	c.quadraticCurveTo(this.c_x,this.c_y,this.x_2,this.y_2)
	   	c.strokeStyle = this.edge_colour;
			c.lineWidth = 2;
	   	c.stroke();

			var m = (this.y_2 - this.c_y)/(this.x_2 - this.c_x)
			if(this.c_x < this.x_2){
				var x_i = this.x_2 - 32/(Math.sqrt(1+m**2))
				var y_i = this.y_2 - (32*m)/(Math.sqrt(1+m**2))
			} else if(this.c_x > this.x_2){
				var x_i = this.x_2 + 32/(Math.sqrt(1+m**2))
				var y_i = this.y_2 + (32*m)/(Math.sqrt(1+m**2)) //40 indicated the positioning of the arrowheads
			}


			var from = {x:this.c_x, y:this.c_y}
			var to = {x:x_i, y:y_i}
			drawArrowhead(c,from,to,10); //15 represents the "radius" of the arrowheads

	   	c.beginPath();
	   	c.strokeStyle = this.edge_colour;
	   	c.stroke();
	   	c.font = "30px Arial";
			c.fillStyle = "black";
			c.textBaseline = "middle";
			if (this.weight != 0){
				if (this.c_x > this.x_2 && this.c_y < this.y_2 || this.c_x < this.x_2 && this.c_y < this.y_2){
					c.textAlign = "left";
				} else if (this.c_x < this.x_2 && this.c_y > this.y_2 || this.c_x > this.x_2 && this.c_y > this.y_2){
					c.textAlign = "right";
				}

		   	c.fillText(this.weight, this.c_x,this.c_y);
			}

		}

	}

	this.update = function(){
		this.draw()
	}
	this.changeweight = function(we){
		this.weight = (parseFloat(this.weight) + parseFloat(we)).toFixed(2)
	}
	this.resetweight = function(){
		this.weight = this.init_weigth
	}

	this.updateEdgeStart = function(new_x_1,new_y_1){
		this.x_1 = new_x_1;
		this.y_1 = new_y_1;
	}
	this.updateEdgeEnd = function(new_x_2,new_y_2){
		this.x_2 = new_x_2;
		this.y_2 = new_y_2;
	}
}

///////////////////////////////////////////////////////////////////////////////
var nodeArray = [];
for (var i = 0; i < JSON_OBj["nodes"].length; i++){
	var id = JSON_OBj["nodes"][i]["id"]
	var x = (JSON_OBj["nodes"][i]["x_pos"] + (canvas.width)/2)
	var y = (JSON_OBj["nodes"][i]["y_pos"] + (canvas.height)/2)
	nodeArray.push(new Node(x,y,id))
}
///////////////////////////////////////////////////////////////////////////////
var edgeArray = [];
for (var i = 0; i <JSON_OBj["edges"].length; i++){
	var index_1 = JSON_OBj["edges"][i]["from"]
	var index_2 = JSON_OBj["edges"][i]["to"]
	var weight  = (JSON_OBj["edges"][i]["weight"]).toFixed(2)
	var x_1 = ((JSON_OBj["nodes"][index_1]["x_pos"]) + (canvas.width)/2)
	var y_1 = ((JSON_OBj["nodes"][index_1]["y_pos"]) +  (canvas.height)/2)
	var x_2 = ((JSON_OBj["nodes"][index_2]["x_pos"]) +  (canvas.width)/2)
	var y_2 = ((JSON_OBj["nodes"][index_2]["y_pos"]) +  (canvas.height)/2)


	edgeArray.push(new Edge(x_1,y_1,x_2,y_2,weight,index_1,index_2))
}
///////////////////////////////////////////////////////////////////////////////
var selectbutton = new button((canvas.width)/8, 0.75*(canvas.height), 125, 40, "CHECK", interaction)
var endbutton = new button((canvas.width)/8, (0.75*(canvas.height)+45), 125, 40, "SUBMIT", endinteraction)
var resetbutton = new button((canvas.width)/8, (0.75*(canvas.height)+90), 125, 40, "RESET", reset)
var scramblebutton = new button(7*(canvas.width)/8, (0.75*(canvas.height)+45), 125, 40, "MIX", Mix)
///////////////////////////////////////////////////////////////////////////////
function refresh() {
	requestAnimationFrame(refresh);
	c.clearRect(0,0,innerWidth, innerHeight);

	for (var i = 0; i < edgeArray.length; i++){
		edgeArray[i].update()
	}

	for (var i = 0; i < nodeArray.length; i++){
		nodeArray[i].update()
	}
	selectbutton.update()
	endbutton.update()
	resetbutton.update()
	scramblebutton.update()

}

refresh();
