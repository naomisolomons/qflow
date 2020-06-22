var canvas = document.querySelector('canvas');
var inter = false
var included = []
var counter_included = []
var cycle_edges = {}
var counter_cycle_edges = {}
var selectedarr = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
///c.translate((window.innerWidth)/2,(window.innerHeight)/2)

var Graph_STR = document.getElementsByClassName("div1")[0].getAttribute("data-graph");
var fixed = Graph_STR.replace(/[']/g,"\"");
var JSON_OBj = JSON.parse(fixed);
var mouse = {
		x: 0,
		y: 0
	}
var w = window.innerWidth;
var h = window.innerHeight;
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
function Cyclecheck() {
	for (var i = 0; i < selectedarr.length; i++){
		included.push(false)
		counter_included.push(false)
	}
	for (var i =0; i< selectedarr.length; i++){
		if (i == (selectedarr.length-1)){
			var edgecan = [selectedarr[i],selectedarr[0]];
			if (selectedarr.length == 2){
				var counter_edgecan = [selectedarr[i],selectedarr[i]];
			}else {
				var counter_edgecan = [selectedarr[0],selectedarr[i]];
			}
		}else {
			var edgecan = [selectedarr[i],selectedarr[i+1]];
			if (selectedarr.length == 2){
				var counter_edgecan = [selectedarr[i],selectedarr[i]];
			}else {
				var counter_edgecan = [selectedarr[i+1],selectedarr[i]];
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
		interaction();
		}
	}
///////////////////////////////////////////////////////////////////////////////

function interaction (){
	for (var i = 0; i < selectedarr.length; i++){
		nodeArray[selectedarr[i]].changecol("green");
		inter = true
	}
}
///////////////////////////////////////////////////////////////////////////////
document.addEventListener('wheel', function(event) {
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
			alert("You Win")
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
		c.rect(this.x,this.y,this.width,this.height);
		c.fillStyle = "black";
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
	this.radius = 30;
	this.colour = 'black'

	this.draw = function() {
		c.beginPath();
	  c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
	  c.strokeStyle = this.colour;
	  c.stroke();
	  c.fillStyle = this.colour;
	  c.fill();
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

		this.draw()
	}
	this.changecol = function(colour){
		this.colour = colour
	}
}
///////////////////////////////////////////////////////////////////////////////
function Edge(x_1, y_1, x_2, y_2,c_x,c_y,weight){
	this.x_1 = x_1;
	this.y_1 = y_1;
	this.x_2 = x_2;
	this.y_2 = y_2;
	this.c_x = c_x;
	this.c_y = c_y;
	this.edge_colour = 'black'
	this.k = 1.15
	this.r = 50
	this.x_s = this.k * (this.x_1 - (window.innerWidth)/2) +(window.innerWidth)/2
	this.y_s = this.k * (this.y_1 - (window.innerHeight)/2) +(window.innerHeight)/2
	this.weight = weight
	this.init_weigth = weight
	this.draw = function(){
		if (this.x_1 == this.x_2 && this.y_1 == this.y_2){
			c.beginPath();
	   	c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
	   	c.strokeStyle = this.edge_colour;
	   	c.stroke();
	   	c.font = "30px Arial";
			c.fillStyle = "black";
	   	c.fillText(this.weight, 1.25 * (this.x_1 - (window.innerWidth)/2) +(window.innerWidth)/2, 1.25 * (this.y_1 - (window.innerHeight)/2) +(window.innerHeight)/2);
		}else{
			c.beginPath();
	   	c.moveTo(this.x_1,this.y_1);
	   	c.quadraticCurveTo(this.c_x,this.c_y,this.x_2,this.y_2)
	   	c.strokeStyle = this.edge_colour;
	   	c.stroke();
	   	c.beginPath();
	   	///c.arc(((this.x_1)/4 + (this.c_x)/2 + (this.x_2)/4),((this.y_1)/4 + (this.c_y)/2 + (this.y_2)/4),this.r,0,Math.PI * 2, false);
	   	c.strokeStyle = this.edge_colour;
	   	c.stroke();
	   	c.font = "30px Arial";
			c.fillStyle = "black";
	   	c.fillText(this.weight, this.c_x,this.c_y);
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
}
///////////////////////////////////////////////////////////////////////////////
var nodeArray = [];
for (var i = 0; i < JSON_OBj["nodes"].length; i++){
	var id = JSON_OBj["nodes"][i]["id"]
	var x = JSON_OBj["nodes"][i]["x_pos"] + (window.innerWidth)/2
	var y = JSON_OBj["nodes"][i]["y_pos"] + (window.innerHeight)/2
	nodeArray.push(new Node(x,y,id))
}
///////////////////////////////////////////////////////////////////////////////
var edgeArray = [];
for (var i = 0; i <JSON_OBj["edges"].length; i++){
	var index_1 = JSON_OBj["edges"][i]["from"]
	var index_2 = JSON_OBj["edges"][i]["to"]
	var weight  = (JSON_OBj["edges"][i]["weight"]).toFixed(2)
	var x_1 = (JSON_OBj["nodes"][index_1]["x_pos"]) + (window.innerWidth)/2
	var y_1 = (JSON_OBj["nodes"][index_1]["y_pos"]) +  (window.innerHeight)/2
	var x_2 = (JSON_OBj["nodes"][index_2]["x_pos"]) +  (window.innerWidth)/2
	var y_2 = (JSON_OBj["nodes"][index_2]["y_pos"]) +  (window.innerHeight)/2
	var x_m = (x_1 + x_2) /2
	var y_m = (y_1 + y_2) /2
	var scl = 0.2
	var c_x = x_m + scl*(y_2-y_1)
	var c_y = y_m - scl*(x_2-x_1)

	edgeArray.push(new Edge(x_1,y_1,x_2,y_2,c_x,c_y,weight))
}
///////////////////////////////////////////////////////////////////////////////
var selectbutton = new button((window.innerWidth)/8, 0.75*(window.innerHeight), 125, 40, "CHECK", Cyclecheck)
var endbutton = new button((window.innerWidth)/8, (0.75*(window.innerHeight)+45), 125, 40, "END", endinteraction)
var resetbutton = new button((window.innerWidth)/8, (0.75*(window.innerHeight)+90), 125, 40, "RESET", reset)
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
}

refresh();
