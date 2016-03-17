$( function() {
	var body = document.querySelector('body');
	body.style.height = window.innerHeight + 'px';

    var socket = io();
    socket.emit( 'join', ~~(Math.random()*10) );

		socket.on( 'cells', function(data){
			console.log(data);
		});

		var circle = d3.select("#visual")
			.append("svg")
			.attr("width", "100%")
			.attr("height", window.innerHeight)
			.append("circle")
			.attr("cx", 200)
			.attr("cy", 200)
			.attr("r", 100)
			.style("fill", "red")

		socket.on( 'gesture', function(data){
			// console.log(data);
			circle
				.attr("cx", data.x+"%")
				.attr("cy", data.y+"%")
				.attr("r", data.y/3+"%")


		});

		body.addEventListener('click', function(e){
			console.log('click', { x:e.clientX, y:e.clientY } );
			socket.emit('click', { x:e.clientX, y:e.clientY } );
		});
} );
