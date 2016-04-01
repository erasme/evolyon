int NB_CELLS = 20; // init cell numbers
//ArrayList<Cell> cells = new ArrayList<Cell>();
// boolean sleeping = false;
// int frameDrop;
ParticleSystem ps;

PVector gravity;
PVector ootsideBox;
int ootsideBoxSize = 150;

void setup() {
	size(w, h);

	noFill();
	smooth();
	noCursor();

	ps = new ParticleSystem();
	// init cells
	for (int i=0; i<NB_CELLS; i++) {
		ps.addNewRandomCell(random(width), random(height));
	}
	
	gravity = new PVector(0, 0.1);
	ootsideBox = new PVector(width/2-8, height/2-100);
	ps.sleep();
	// ps.awake();
}

void sleep(){
	ps.sleep();
}

void awake(){
	ps.awake();
}

void draw() {
	background(#241f38);

	ps.run();

	// ellipse(ootsideBox.x,ootsideBox.y,ootsideBoxSize,ootsideBoxSize);
}

void presence(){
	for(Cell c : ps.cells){
        float desiredseparation = ootsideBoxSize*1.2;

        //Collide with center
        float d1 = PVector.dist(c.location, ootsideBox);
        if ((d1 > 0) && (d1 < ootsideBoxSize + 100)) {
            // Calculate vector pointing away from neighbor
            PVector diff = PVector.sub(c.location, ootsideBox);
            // diff.normalize();
            // diff.div(d1);        // Weight by distance
			c.applyForce(diff);    		
        }
	}
}

void emitCell() {
	console.log("emitCell");
	ps.selectCell();
}

void keyPressed() {
	if (key == 's') {
		ps.sleep();
	} 
	else if (key == 'a') {
		ps.awake();
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
	int x = ootsideBox.x;
	int y = height/4;
	Cell c = (Cell) new Triangle(x, y);
	ps.cells.add(c);
}

void newBlob() {
	int x = ootsideBox.x;
	int y = height/4;
	Cell c = (Cell) new Blob(x, y);
	ps.cells.add(c);
}

void newSquare() {
	int x = ootsideBox.x;
	int y = height/4;
	Cell c = (Cell) new Square(x, y);
	ps.cells.add(c);
}

void split(){
	ps.addNewRandomCell(random(width), random(height));
}

float squareDist(Cell c1, Cell c2) {
	return (c1.centre.x - c2.centre.x)*(c1.centre.x - c2.centre.x) + (c1.centre.y - c2.centre.y)*(c1.centre.y - c2.centre.y);
}

float ease(float value, float target, float easingVal) {
	float d = target - value;
	if (abs(d)>1) value+= d*easingVal;
	else value = target;
	return value;
}