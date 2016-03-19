var x= 0,
	y =0,
	z= 0;
var w, h;

var cells = [];

var body = document.querySelector('body');
body.style.height = window.innerHeight + 'px';

var socket = io();
socket.emit( 'join', ~~(Math.random()*10) );

socket.on( 'cells', function(data){
	cells = data;
});

var abribus = { "height" : 120, "width" : 176};

// size of the abribus
h = window.innerHeight-50;
w = (120/176)*h;

// mouse events for web version
d3.select("canvas")
  .on("mousemove", function(d){

			// convert x and y on a range from 0 to 100
			x = (d3.mouse(this)[0]/w)*100;
			y = (d3.mouse(this)[1]/h)*100;

			console.log(x,y);
	})

socket.on( 'gesture', function(data){
	// console.log(data);
	x = data.x;
	y = data.y;
	z = data.z;

});

socket.on( 'hit', function(data){
	console.log("hit");
})

socket.on( 'swipe', function(data){
	console.log("swipe");
})

socket.on( 'shake', function(data){
	console.log("shake");
})
