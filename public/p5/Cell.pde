final static float SPEED = 0.001;
final static int RADIUS_MAX = 10;

class Cell {
	PVector location;
	PVector velocity;
    PVector acceleration;
    float topspeed;
    float mass = 1;
	// PVector target;

	int nbCotes;
	float cellRayon;
	float rayon;
	float tarRayon;
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
	boolean colliding = true;
	int collidingTime = 0;


	Cell() {}

	Cell(float locationX_, float locationY_, int nbCotes_, float angle_, float amplitude_) {
		location = new PVector( locationX_, locationY_ );
        acceleration = new PVector(random(1, 5), random(1,5));
        velocity = new PVector(0, 0);
		// target = new PVector(random (rayon, width-rayon), random (rayon, height-rayon) );

		nbCotes = nbCotes_;
		topspeed = (nbCotes == 3) ? 1.5 : 
					(nbCotes == 4) ? .5 : 
					1.; 
		rayon = int( random(15, RADIUS_MAX));
		tarRayon = rayon;
		cellRayon = rayon;
		angle = angle_;
		amplitude = amplitude_;
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

	/*void drop() {
		dropped = true;
	}

	void raise() {
		dropped = false;
	}*/

	boolean kicked = false;
	int originKicked;
	int kickDuration = 10;
	void kick() {
		originKicked = frameCount;
		kicked = true;
	}

	void disappear() {
		tarRayon = 0;
	}

	void applyForce(PVector force) {
		PVector f = PVector.div(force,mass);
		acceleration.add(f);
	}

	void update() {
        if( frameCount % (delay*3) == 0 ) {
            acceleration = PVector.random2D();
            acceleration.mult(random(2));
        }

        velocity.add(acceleration);
        velocity.limit(topspeed);
        location.add(velocity);

        rayon = ease(rayon, tarRayon, 0.05);
        checkBoundaries();
		
		/*if( selected ){
			target.x = width/2;
			target.y = height/2;

			location.x = ease(location.x, target.x, 0.01);
			location.y = ease(location.y, target.y, 0.01);

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
				location.x = ease(location.x, target.x, easing );
				location.y = ease(location.y, target.y, easing);
			}
		}*/
	}


	void checkBoundaries(){
        if ((location.x > width-cellRayon) || (location.x < cellRayon)) {
            location.x = constrain( location.x, cellRayon+1, width-cellRayon-1 );
            acceleration.x = acceleration.x * -1;
        }
        if ((location.y > height-cellRayon) || (location.y < cellRayon)) {
            location.y = constrain( location.y, cellRayon+1, height-cellRayon-1 );
            acceleration.y = acceleration.y * -1;
        }
	}

	boolean collideEqualMass(Cell other) {
		float d = PVector.dist(location, other.location);
		float sumR = rayon + other.rayon;

		if (frameCount - collidingTime > 20 && frameCount - other.collidingTime > 20 && !colliding && d < sumR) {
			colliding = true;
			// Direction of one object another
			PVector n = PVector.sub(other.location, location);
			n.normalize();

			// Difference of velocities so that we think of one object as stationary
			PVector u = PVector.sub(acceleration,other.acceleration);

			// Separate out components -- one in direction of normal
			PVector un = componentVector(u,n);
			// Other component
			u.sub(un);
			// These are the new velocities plus the velocity of the object we consider as stastionary
			acceleration = PVector.add(u,other.acceleration);
			other.acceleration = PVector.add(un,other.acceleration);

			if (random(1) > .5) {
				onCollision(other);
			} else {
				other.onCollision(this);
			}
			return true;
		} 
		else return false;
	}

	void display() {
		stroke(couleur, 20);
		strokeWeight(12);
		polygon(location, nbCotes, rayon, angle, 1, false);

		stroke(couleur, 30);
		strokeWeight(8);
		polygon(location, nbCotes, rayon, angle, 1, false);
		
		stroke(couleur);
		strokeWeight(2);
		polygon(location, nbCotes, rayon, angle, 1, false);
	}

	void polygon(PVector location, int nbCotes, int radius, float angle, float amplitude, boolean bordRond) {
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
				curveVertex(location.x+pos[i].x, location.y+pos[i].y);
				curveVertex(location.x+middles[i].x, location.y+middles[i].y);

				if (i == nbCotes-1) {
					curveVertex(location.x+pos[0].x, location.y+pos[0].y);
					curveVertex(location.x+middles[0].x, location.y+middles[0].y);
				}
			} else {
				vertex(location.x+pos[i].x, location.y+pos[i].y);
				vertex(location.x+middles[i].x, location.y+middles[i].y);
			}
		}
		endShape(CLOSE);
	}

	void run() {
		update();
		display();
	}

	boolean isDead() {
		if (rayon < 1) {
			return true;
		} else {
			return false;
		}
	}

	void onCollision(Cell targetCell) {
	}
};


PVector componentVector (PVector vector, PVector directionVector) {
	//--! ARGUMENTS: vector, directionVector (2D vectors)
	//--! RETURNS: the component vector of vector in the direction directionVector
	//-- normalize directionVector
	directionVector.normalize();
	directionVector.mult(vector.dot(directionVector));
	return directionVector;
}