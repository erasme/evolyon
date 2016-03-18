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


// 	console.log(w,h);
//
// 	var svg = d3.select("#visual")
// 		.append("svg")
// 		.attr("width", w)
// 		.attr("height", h)
//
//
// 	var nodes = d3.range(500).map(function() { return {radius: Math.random() * 12 + 4}; }),
// 	    color = d3.scale.category10();
//
// 	var force = d3.layout.force()
// 	    .gravity(0.02)
// 	    .charge(function(d, i) { return i ? 0 : -1000; })
// 	    .nodes(nodes)
// 	    .size([w, h]);
//
// 	var root = nodes[0];
// 	root.radius = 0;
// 	root.fixed = true;
//
// 	force.start();
//
// 	// var svg = d3.select("#visual")
//
//
// svg.selectAll("circle")
//     .data(nodes.slice(1))
//   .enter().append("svg:circle")
//     .attr("r", function(d) { return d.radius - 2; })
//     .style("fill", function(d, i) { return color(i % 3); });
//
// 		force.on("tick", function(e) {
//   var q = d3.geom.quadtree(nodes),
//       i = 0,
//       n = nodes.length;
//
//   while (++i < n) {
//     q.visit(collide(nodes[i]));
//   }
//
//   svg.selectAll("circle")
//       .attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; });
// });


function collide(node) {
var r = node.radius + 16,
  nx1 = node.x - r,
  nx2 = node.x + r,
  ny1 = node.y - r,
  ny2 = node.y + r;
return function(quad, x1, y1, x2, y2) {
if (quad.point && (quad.point !== node)) {
  var x = node.x - quad.point.x,
      y = node.y - quad.point.y,
      l = Math.sqrt(x * x + y * y),
      r = node.radius + quad.point.radius;
  if (l < r) {
    l = (l - r) / l * .5;
    node.x -= x *= l;
    node.y -= y *= l;
    quad.point.x += x;
    quad.point.y += y;
  }
}
return x1 > nx2
    || x2 < nx1
    || y1 > ny2
    || y2 < ny1;
};
}



socket.on( 'gesture', function(data){
	// console.log(data);
	x = data.x;
	y = data.y;
	z = data.z;

	// if (data.active) {
	// 	root.px = (data.x/100)*w;
	//   root.py = (data.y/100)*h;
  // 	force.resume();
	// }
	// circle
	// 	.attr("cx", data.x+"%")
	// 	.attr("cy", 100-data.y+"%")
	// 	.attr("r", data.z/12+"%")
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
