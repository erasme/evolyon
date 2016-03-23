final static float SPEED = 0.001;
final static int RADIUS_MAX = 10;

class Cell {
	PVector centre;
	PVector target;
	PVector speed;

	int nbCotes;
	int cellRayon;
	int rayon;
	float cellEasing; // backup the values
	float easing;
	float angle, tarAngle = 0;
	float amplitude;
	color couleur;
	int delay;

	boolean dropped;
	boolean selected = false;
	int selectedTime = 0;
	boolean appearing;
	boolean isHit = true;


	Cell() {}

	Cell(float centreX_, float centreY_, int nbCotes_, float angle_, float amplitude_) {
		centre = new PVector( centreX_, centreY_ );
		target = new PVector(random (rayon, width-rayon), random (rayon, height-rayon) );
		nbCotes = nbCotes_;
		rayon = int( random(15, RADIUS_MAX));
		angle = angle_;
		amplitude = amplitude_;

		cellRayon = rayon;

		cellEasing = random(0, SPEED);
		easing = cellEasing;

		delay = int(random(75, 100));
		dropped = false;

		// init creation
		appearing = true;

		// couleur
		if (nbCotes_ == 3) couleur = #ff217c;
		else if (nbCotes_ == 4) couleur = #0dffe1;
		else couleur = #a184b7;

	}

	void drop() {
		dropped = true;
	}

	void raise() {
		dropped = false;
	}

	boolean kicked = false;
	int originKicked;
	int kickDuration = 10;
	void kick() {
		originKicked = frameCount;
		kicked = true;
	}

	boolean disappearing = false;
	void disappear() {
		disappearing = true;
	}

	void move() {
		
		/*if( selected ){
			// targetX = width/2;
			// targetY = height/2;
			target.x = width/2;
			target.y = height/2;

			// centreX = ease(centreX, targetX, 0.01);
			// centreY = ease(centreY, targetY, 0.01);
			centre.x = ease(centre.x, target.x, 0.01);
			centre.y = ease(centre.y, target.y, 0.01);

			rayon = max( ++rayon, 70 );
			if( frameCount % 25 ) tarAngle = random(360);
			angle = ease(angle, tarAngle, 0.1);

			selectedTime++;
			if( selectedTime > 300 ){
				rayon = 0;

				socket.emit("emitCell", {
					"nbCotes" : c.nbCotes,
					"r" : c.r,
					"color" : c.couleur
				});
			}
		}
		else{
			if ( dropped == true ) {
				targetY = int( random(height-rayon, height) );
			} else if ( frameCount % delay  == 0 ) {
				target.x = random (rayon, width-rayon);
				target.y = random (rayon, height-rayon);
			}

			target.x = constrain(target.x, rayon, width-rayon);
			target.y = constrain(target.y, rayon, height-rayon);


			if (kicked) {
				easing = .3;

				// println(frameCount - originKicked, originKicked);
				if ( frameCount - originKicked == kickDuration) {
					easing = cellEasing;
					kicked = false;
				}
			}

			if (disappearing) {
				rayon--;
			}

			if (!disappearing && (rayon < cellRayon)) {
				rayon++;
				appearing = true;
			} else {
				appearing = false;
			}

			if (disappearing || appearing) {
			} else {
				centre.x = ease(centre.x, target.x, easing );
				centre.y = ease(centre.y, target.y, easing);
			}
		}*/
	}

	float ease(float value, float target, float easingVal) {
		float d = target - value;
		if (abs(d)>1) value+= d*easingVal;
		return value;
	}

	void bounce(){
        if ((centre.x > width) || (centre.x < 0)) {
            velocity.x = velocity.x * -1;
        }
        if ((centre.y > height) || (centre.y < 0)) {
            velocity.y = velocity.y * -1;
        }
	}

	void draw() {
		stroke(couleur, 20);
		strokeWeight(12);
		polygon(centre, nbCotes, rayon, angle, 1, false);

		stroke(couleur, 30);
		strokeWeight(8);
		polygon(centre, nbCotes, rayon, angle, 1, false);
		
		stroke(couleur);
		strokeWeight(2);
		polygon(centre, nbCotes, rayon, angle, 1, false);
	}

	void polygon(PVector centre, int nbCotes, int radius, float angle, float amplitude, boolean bordRond) {
		PVector[] pos = new PVector[nbCotes];
		for (int i=0; i<nbCotes; i++) {
			pos[i] = new PVector( cos(radians(angle + 360./nbCotes * i)) * radius, sin(radians(angle + 360./nbCotes * i)) * radius);
		}


		PVector[] middles = new PVector[nbCotes];
		for (int i=0; i<nbCotes; i++) {
			middles[i] = new PVector(
				(pos[ i ].x + pos[ (i+1) % nbCotes ].x ) / 2,
				(pos[ i ].y + pos[ (i+1) % nbCotes ].y ) / 2
				);
			middles[i].mult(amplitude);
		}
		curveTightness(0.2);
		beginShape();
		for (int i=0; i<nbCotes; i++) {
			if (bordRond) {
				curveVertex(centre.x+pos[i].x, centre.y+pos[i].y);
				curveVertex(centre.x+middles[i].x, centre.y+middles[i].y);

				if (i == nbCotes-1) {
					curveVertex(centre.x+pos[0].x, centre.y+pos[0].y);
					curveVertex(centre.x+middles[0].x, centre.y+middles[0].y);
				}
			} else {
				vertex(centre.x+pos[i].x, centre.y+pos[i].y);
				vertex(centre.x+middles[i].x, centre.y+middles[i].y);
			}
		}
		endShape(CLOSE);
	}

	void onCollision(Cell targetCell) {
	}
};
