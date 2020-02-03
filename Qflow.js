var canvas = document.querySelector('canvas');


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

function Node(x,y) {
	this.x = x;
	this.y = y;
	this.radius = 30;
	this.clicked  = false
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
	
	if (dist < this.radius && this.clicked == false){
		this.clicked = true
		this.colour = 'red'
		clearm()
	} else if (dist < this.radius && this.clicked == true){
		this.clicked = false
		this.colour = 'black'
		clearm()
	}
	
		this.draw()
	}
}

function Edge(x_1, y_1, x_2, y_2,c_x,c_y){
	this.x_1 = x_1;
	this.y_1 = y_1;
	this.x_2 = x_2;
	this.y_2 = y_2;
	this.c_x = c_x;
	this.c_y = c_y;
	this.colour = 'black'
	this.k = 1.15
	this.r = 50
	this.x_s = this.k * (this.x_1 - (window.innerWidth)/2) +(window.innerWidth)/2
	this.y_s = this.k * (this.y_1 - (window.innerHeight)/2) +(window.innerHeight)/2
	
	this.draw = function(){
		if (this.x_1 == this.x_2 && this.y_1 == this.y_2){
			c.beginPath();
	   	c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
	   	c.strokeStyle = this.colour;
	   	c.stroke();
		}else{
			c.beginPath();
	   	c.moveTo(this.x_1,this.y_1);
	   	c.quadraticCurveTo(this.c_x,this.c_y,this.x_2,this.y_2)
	   	c.strokeStyle = this.colour;
	   	c.stroke();
	   	
		}
	}
	
	this.update = function(){
		this.draw()
	}
}

var nodeArray = [];
for (var i = 0; i < JSON_OBj["nodes"].length; i++){
	var x = JSON_OBj["nodes"][i]["x_pos"] + (window.innerWidth)/2
	var y = JSON_OBj["nodes"][i]["y_pos"] + (window.innerHeight)/2 
	nodeArray.push(new Node(x,y))
}

var edgeArray = [];
for (var i = 0; i <JSON_OBj["edges"].length; i++){
	var index_1 = JSON_OBj["edges"][i]["from"]
	var index_2 = JSON_OBj["edges"][i]["to"]
	var x_1 = (JSON_OBj["nodes"][index_1]["x_pos"]) + (window.innerWidth)/2
	var y_1 = (JSON_OBj["nodes"][index_1]["y_pos"]) +  (window.innerHeight)/2
	var x_2 = (JSON_OBj["nodes"][index_2]["x_pos"]) +  (window.innerWidth)/2
	var y_2 = (JSON_OBj["nodes"][index_2]["y_pos"]) +  (window.innerHeight)/2
	var m = (y_2-y_1)/(x_2-x_1)
	var x_m = (x_1 + x_2) /2
	var y_m = (y_1 + y_2) /2
	var d = Math.sqrt((y_1 - y_2)**2+(x_1 - x_2)**2)
	var scl = 0.2
	var c_x = x_m + scl*(y_2-y_1)
	var c_y = y_m - scl*(x_2-x_1)
	
	edgeArray.push(new Edge(x_1,y_1,x_2,y_2,c_x,c_y))
}

function refresh() {
	requestAnimationFrame(refresh);
	c.clearRect(0,0,innerWidth, innerHeight);

	for (var i = 0; i < edgeArray.length; i++){
		edgeArray[i].update()
	}
	
	for (var i = 0; i < nodeArray.length; i++){
		nodeArray[i].update()
	}
}

refresh();