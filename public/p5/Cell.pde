final static float SPEED = 0.001;
final static int RADIUS_MAX = 10;

class Cell {
    float centreX;
    float centreY;
    float targetX;
    float targetY;
    int nbCotes;
    int rayon;
    float angle, tarAngle = 0;
    float amplitude;
    color couleur;
    int delay;

    boolean dropped;
    boolean selected = false;
    int selectedTime = 0;

    float easing;
    float cellEasing; // backup the values

    int cellRayon;
    boolean appearing;

    boolean isHit = true;


    Cell() {
        // empty
    }

    Cell(float centreX_, float centreY_, int nbCotes_, float angle_, float amplitude_) {
        centreX = centreX_;
        centreY = centreY_;
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
        if (nbCotes_ == 3) {
            couleur = color(#ff217c);
        } else if (nbCotes_ == 4) {
            couleur = color(#0dffe1);
        } else {
            couleur = color(#0da3e1);
        }
        targetX = int(random (rayon, width-rayon));
        targetY = int(random (rayon, height-rayon));
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
        // couleur = #CCCC00;
    }

    boolean disappearing = false;
    void disappear() {
        disappearing = true;
    }

    void move() {
    	if( selected ){
    		targetX = width/2;
    		targetY = height/2;

            centreX = ease(centreX, targetX, 0.01);
            centreY = ease(centreY, targetY, 0.01);

            rayon = min( ++rayon, 50 );
            if( frameCount % 25 ) tarAngle = random(360);
            angle = ease(angle, tarAngle, 0.1);

            selectedTime++;
            if( selectedTime > 300 ){
            	rayon = 0;

    				socket.emit("emitCell", {
    					"nbCotes" : nbCotes,
    					"r" : rayon,
    					"color" : [red(couleur), green(couleur), blue(couleur)]
    				});
            }
		}
		else{
	        if ( dropped == true ) {
	            targetY = int( random(height-rayon, height) );
	        } else if ( frameCount % delay  == 0 ) {
	            targetX = random (rayon, width-rayon);
	            targetY = random (rayon, height-rayon);
	        }

	        targetX = constrain(targetX, rayon, width-rayon);
	        targetY = constrain(targetY, rayon, height-rayon);


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
	            centreX = ease(centreX, targetX, easing );
	            centreY = ease(centreY, targetY, easing);
	        }
	    }
    }

    float ease(float value, float target, float easingVal) {
        float d = target - value;
        if (abs(d)>1) value+= d*easingVal;
        return value;
    }

    void draw() {
        fill(couleur);
        stroke(couleur, 30);
        strokeWeight(8);
        polygon(centreX, centreY, nbCotes, rayon, angle, 1, false);

        stroke(couleur, 20);
        strokeWeight(12);
        polygon(centreX, centreY, nbCotes, rayon, angle, 1, false);

        stroke(couleur);
        strokeWeight(2);
        polygon(centreX, centreY, nbCotes, rayon, angle, 1, false);
    }

    void polygon(float centreX, float centreY, int nbCotes, int radius, float angle, float amplitude, boolean bordRond) {
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
                curveVertex(centreX+pos[i].x, centreY+pos[i].y);
                curveVertex(centreX+middles[i].x, centreY+middles[i].y);

                if (i == nbCotes-1) {
                    curveVertex(centreX+pos[0].x, centreY+pos[0].y);
                    curveVertex(centreX+middles[0].x, centreY+middles[0].y);
                }
            } else {
                vertex(centreX+pos[i].x, centreY+pos[i].y);
                vertex(centreX+middles[i].x, centreY+middles[i].y);
            }
        }
        endShape(CLOSE);
    }

    void onCollision(Cell targetCell) {
    }
}
