$( function() {
	var body = document.querySelector('body');
	body.style.height = window.innerHeight + 'px';

    var socket = io();
    socket.emit( 'join', ~~(Math.random()*10) );

		socket.on( 'cells', function(data){
			console.log(data);
		});



		var svg = d3.select("#visual")
			.append("svg")
			.attr("width", "100%")
			.attr("height", window.innerHeight)
		// 	.append("circle")
		// 	.attr("cx", 200)
		// 	.attr("cy", 200)
		// 	.attr("r", 100)
		// 	.style("fill", "red")

		var i = 0;

		socket.on( 'gesture', function(data){
			// console.log(data);

			  // var m = d3.mouse(this);

			  svg.insert("circle", "rect")
			      .attr("cx", data.x+"%")
			      .attr("cy", 100-data.y+"%")
			      .attr("r", data.z/12+"%")
			      .style("stroke", "lime")//d3.hsl((i = (i + 1) % 360), 1, .5))
			      .style("stroke-opacity", 1)
			    .transition()
			      .duration(2000)
			      .ease(Math.sqrt)
			      .attr("r", 100)
			      .style("stroke-opacity", 1e-6)
			      .remove();


			// circle
			// 	.attr("cx", data.x+"%")
			// 	.attr("cy", 100-data.y+"%")
			// 	.attr("r", data.z/12+"%")


		});

		body.addEventListener('click', function(e){
			console.log('click', { x:e.clientX, y:e.clientY } );
			socket.emit('click', { x:e.clientX, y:e.clientY } );
		});
} );
