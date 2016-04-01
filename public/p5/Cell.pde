final static float SPEED = 0.001;
final static int RADIUS_MAX = 10;

class Cell {
	PVector location;
	PVector tarLocation;
	PVector velocity;
    PVector acceleration;
    float mass = 1;
    float maxspeed = 3;
    float maxforce = 0.2;

	int nbCotes;
	float cellRayon;
	float rayon;
	float tarRayon;
	float cellEasing;
	float easing;
	float angle, tarAngle = 0;
	float amplitude;
	color couleur;
	int delay;

	boolean selected = false;
	int selectedTime = 0;

	boolean sleeping = false;
	boolean hitting = false;
	boolean created = true;
	int wakeupTime = -2000;

	boolean kicked = false;
	PVector kickedForce;

	Cell() {}

	Cell(float locationX_, float locationY_, int nbCotes_, float angle_, float amplitude_) {
		location = new PVector( locationX_, locationY_ );
		tarLocation = new PVector(random(width),random(height));
        acceleration = new PVector(random(1, 5), random(1,5));
        velocity = new PVector(0, 0);

		nbCotes = nbCotes_;
		maxspeed = (nbCotes == 3) ? 3 :
					(nbCotes == 4) ? 1 :
					.5;
		rayon = int( random(15, RADIUS_MAX));
		tarRayon = rayon;
		cellRayon = rayon;
		angle = angle_;
		amplitude = amplitude_;
		cellEasing = random(0, SPEED);
		easing = cellEasing;
		delay = int(random(75, 100));

		// couleur
		if (nbCotes_ == 3) couleur = #ff217c;
		else if (nbCotes_ == 4) couleur = #0dffe1;
		else couleur = #a184b7;
	}

	void select(){
		selected = true;
		tarRayon = 90;
		selectedTime = frameCount;
	}

	void kick(PVector force) {
		kicked = true;
		kickedForce = new PVector(force.x, force.y);
	}

	void disappear() {
		tarRayon = 0;
	}

	void applyForce(PVector force) {
		PVector f = PVector.div(force,mass);
		acceleration.add(f);
	}

	boolean once = true;
    void update() {
        if (selected) {
        	location.x = ease(location.x, width/2, 0.05);
			location.y = ease(location.y, height/4, 0.05);
	        rayon = ease(rayon, tarRayon, 0.05);
			if( frameCount % 25 ) tarAngle = random(360);
			angle = ease(angle, tarAngle, 0.1);

	        if(once && frameCount - selectedTime > 200){
	        	tarRayon = 0;

				socket.emit("emitCell", {
					"nbCotes": nbCotes,
					"r": cellRayon,
					"color": couleur
				});
				once = false;
	        }
		} else {
			if(frameCount - wakeupTime < 200){
	        	location.x = ease(location.x, tarLocation.x, 0.05);
				location.y = ease(location.y, tarLocation.y, 0.05);
			}
			else{
				rayon = ease(rayon, tarRayon, 0.05);
	            // Update velocity
	            velocity.add(acceleration);
	            // Limit speed
	            velocity.limit(maxspeed);

	            location.add(velocity);
	            checkBoundaries();

	            // Reset accelertion to 0 each cycle
	            acceleration.mult(0);
			}
        }
    }

	void checkBoundaries(){
        if ((location.x > width-cellRayon) || (location.x < cellRayon)) {
            location.x = constrain( location.x, cellRayon+1, width-cellRayon-1 );
            velocity.x = velocity.x * -1;
        }
        if ((location.y > height-cellRayon) || (location.y < cellRayon)) {
            location.y = constrain( location.y, cellRayon+1, height-cellRayon-1 );
            velocity.y = velocity.y * -1;
        }
	}

    void separate (ArrayList<Cell> cells) {
        float desiredseparation = rayon*1.2;
        PVector sum = new PVector();
        int count = 0;

        //Collide with center
        float d1 = PVector.dist(location, ootsideBox);
        if ((d1 > 0) && (d1 < rayon + 100)) {
            // Calculate vector pointing away from neighbor
            PVector diff = PVector.sub(location, ootsideBox);
            diff.normalize();
            diff.div(d1);        // Weight by distance
            sum.add(diff);
            count++;            // Keep track of how many

    		hitting = true;
        }


        for (Cell other : cells) {
            float d = PVector.dist(location, other.location);
            if ((d > 0) && (d < rayon + other.rayon)) {
                // Calculate vector pointing away from neighbor
                PVector diff = PVector.sub(location, other.location);
                diff.normalize();
                diff.div(d);        // Weight by distance
                sum.add(diff);
                count++;            // Keep track of how many
                if( !sleeping && frameCount - ps.awakeTime > 50 ){
            		hitting = true;
            		if(!other.hitting){
            			if(random(1)>.5){
            				onCollision(other);
            			}
            			else{
            				other.onCollision(this);
            			}
            			other.hitting = true;
            		}
            	}

            }
        }
        // Average -- divide by how many
        if (count > 0) {
            // Our desired vector is moving away maximum speed
            sum.setMag(maxspeed);
            // Implement Reynolds: Steering = Desired - Velocity
            PVector steer = PVector.sub(sum, velocity);
            steer.limit(maxforce);
            applyForce(steer);
        }
        else{
        	hitting = false;
        }
    }

	void display() {
		stroke(couleur, 20);
		strokeWeight(12);
		polygon(location, nbCotes, rayon, angle, 1+sin((delay+frameCount)/10.)*.2 , false);

		stroke(couleur, 30);
		strokeWeight(8);
		polygon(location, nbCotes, rayon, angle, 1+sin((delay+frameCount)/10.)*.2, false);

		stroke(couleur);
		strokeWeight(2);
		polygon(location, nbCotes, rayon, angle, 1+sin((delay+frameCount)/10.)*.2, false);
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

	boolean isDead() {
		if (rayon < 1) {
			return true;
		} else {
			return false;
		}
	}

	void onCollision(Cell targetCell) {
		switch(nbCotes){
			case 3:
				if(ps.cells.size() < 80){
					ps.addNewCell(targetCell.location.x, targetCell.location.y, targetCell.nbCotes);
				}
				break;
			case 4:
				targetCell.kick(velocity);
				break;
			case 8:
		        if (ps.cells.size() > 20) {
		        	targetCell.disappear();
		        }
				break;
		}
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
