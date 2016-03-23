int NB_CELLS = 10; // init cell numbers
//ArrayList<Cell> cells = new ArrayList<Cell>();
// boolean sleeping = false;
// int frameDrop;
ParticleSystem ps;

void setup() {
	size(w, h);
	noFill();

	smooth();
	ps = new ParticleSystem();

	// init cells
	for (int i=0; i<NB_CELLS; i++) {
		ps.addNewRandomCell(random(width), random(height));
	}

	// ps.sleep();
}



void draw() {
	background(#241f38);

	// Apply gravity force to all Particles
	// PVector gravity = new PVector(0,0.1);
	// ps.applyForce(gravity);

	ps.run();
}



void emitCell() {
	console.log("emitCell");
	// Cell c = cells.get(int(random(cells.size())));
	// c.selected = true;
}

void keyPressed() {
	Cell c = cells.get(int(random(cells.size())));
	if (key == 'a') {
		// sleepAwakeAll();
	} else if (key == 'm') {
		emitCell();
	} else if (key == 'w') {
		newTriangle();
	} else if (key == 'x') {
		newBlob();
	} else if (key == 'c') {
		newSquare();
	}
}

void newTriangle() {
	int x =int( random(0, width));
	int y = int(random(0,height));
	Cell c = (Cell) new Triangle(x, y);
	cells.add(c);
}

void newBlob() {
	int x =int( random(0, width));
	int y = int(random(0,height));
	Cell c = (Cell) new Blob(x, y);
	cells.add(c);
}

void newSquare() {
	int x =int( random(0, width));
	int y = int(random(0,height));
	Cell c = (Cell) new Square(x, y);
	cells.add(c);
}

void split(){
	ps.addNewRandomCell(random(width), random(height));
}

float squareDist(Cell c1, Cell c2) {
	return (c1.centre.x - c2.centre.x)*(c1.centre.x - c2.centre.x) + (c1.centre.y - c2.centre.y)*(c1.centre.y - c2.centre.y);
}

/*boolean hitTest(Cell c1, Cell c2) {
	// println(squareDist(c1, c2), c1.rayon*c2.rayon);
	if (squareDist(c1, c2) < (c1.rayon*1.8)*(c2.rayon*1.8) ){
		return true;
	} else {
		return false;
	}
}*/

float ease(float value, float target, float easingVal) {
	float d = target - value;
	if (abs(d)>1) value+= d*easingVal;
	else value = target;
	return value;
}