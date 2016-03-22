var eased = new Array();

void setup() {
	size( w, h );
	noFill();
	strokeJoin( ROUND );
	strokeCap( ROUND );
}

void draw() {
	background(0);

	cells.forEach( function( d ){
		if( frameCount % d.delay == 0 ){
			d.dx = int(random( w ));
			d.dy = int(random( h ));
		}
	} );

	var ootX = gesture.x * w;
	var ootY = gesture.y * h;

	// console.log(ootX,ootY);

	for (var i = 0; i < cells.length; i++) {
		cells[i].x = ease(cells[i].x, cells[i].dx, cells[i].easing );
		cells[i].y = ease(cells[i].y, cells[i].dy, cells[i].easing );
		
		var nbCotes = 3;
		var r = 50;

		if( ootX+50 > cells[i].x
			&& ootX-50 < cells[i].x
			&& ootY+50 > cells[i].y
			&& ootY-50 < cells[i].y
		){
			stroke(#a184b7, map(gesture.z, 0, 300, 255, 100) );
			strokeWeight(map(gesture.z, 0, 300, 10, 1 ));

			nbCotes = int(map(gesture.z, 0, 300, 15,3));
			r = int(map(gesture.z, 0, 300, 100, 40));
		}
		else {
			stroke(#a184b7, 100 );
			strokeWeight(1);
		}

		polygon(cells[i].x, cells[i].y, nbCotes, r, -90, sin(frameCount/60.)*0.2+1 );
	}


//	 stroke(#a184b7,30);
//	 strokeWeight(10);
//	 polygon(100, 100, 3, 50, -90, sin(frameCount/60.)*0.2+1);
//	 stroke(#a184b7,20);
//	 strokeWeight(20);
//	 polygon(100, 100, 3, 50, -90, sin(frameCount/60.)*0.2+1);
//
//	 stroke(#ff217c);
//	 strokeWeight(2);
//	 polygon(240, 100, 6, 50, -90, sin(frameCount/60.)*0.2+1);
//
//	 stroke(#0dffe1);
//	 strokeWeight(2);
//	 polygon(400, 100, 8, 50, -90, sin(frameCount/60.)*0.2+1);
//
// for (int i = 0; i<6; i++) {
//	 stroke(#ff217c,25+(i*25));
//	 strokeWeight(10-(i*2));
//	 polygon(400, 220, 8, 50, -90, sin(frameCount/60.)*0.2+1);
// }
//
//	 strokeWeight(2);
//	 stroke(#0dffe1);
//	 line(100, 220, 100, 270);
//	 line(100, 220, 144, 196);
//	 line(100, 220, 55, 196);
//	 polygon(100, 220, 6, 50, -90, 1);
}

void polygon(int centreX, int centreY, int nbCotes, int radius, float angle, float amplitude) {
	PVector[] pos = new PVector[nbCotes];
	for (int i=0; i<nbCotes; i++) {
		pos[i] = new PVector( cos(radians(angle + 360./nbCotes * i)) * radius, sin(radians(angle + 360./nbCotes * i)) * radius);
	}


	PVector[] middles = new PVector[nbCotes];
	for (int i=0; i<nbCotes; i++) {
		middles[i] = new PVector( (pos[ i ].x + pos[ (i+1) % nbCotes ].x ) / 2, (pos[ i ].y + pos[ (i+1) % nbCotes ].y ) / 2);
		middles[i].mult(amplitude);
	}

	beginShape();
	for (int i=0; i<nbCotes; i++) {
		vertex(centreX+pos[i].x, centreY+pos[i].y);
		vertex(centreX+middles[i].x, centreY+middles[i].y);
	}
	endShape(CLOSE);
}

function ease(value, target, easingVal) {
	var d = target - value;
	if (abs(d)>1) value+= d*easingVal;
	return value;
}
