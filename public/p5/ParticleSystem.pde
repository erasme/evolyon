class ParticleSystem {
    ArrayList<Cell> cells;
    boolean sleeping = false;

    ParticleSystem() {
        cells = new ArrayList<Cell>();
    }

	void addNewRandomCell(float _x, float _y) {
		float x = _x;
		float y = _y;

		Cell c = new Cell();
		int cellType = int(random(3));

		switch(cellType) {
		case 0 :
			c = new Triangle(x, y);
			break;
		case 1 :
			c = new Square(x, y);
			break;
		case 2 :
			c = new Blob(x, y);
			break;
		}
		cells.add( c );
	}

    // A function to apply a force to all Cells
    void applyForce(PVector f) {
        for (Cell c : cells) {
            c.applyForce(f);
        }
    }

    void run() {
		for (int i = cells.size()-1; i >= 0; i--) {
			Cell c = cells.get(i);
        	if(sleeping) c.applyForce(gravity);

			c.separate(cells);
            c.update();
            c.display();

            if (c.isDead()) {
                cells.remove(i);
            }

			/*boolean newHit = false;
			for ( int j=i-1; j >= 0; j-- ) {
				Cell c2 = cells.get( j );
				if(!c.colliding && c.collideEqualMass( c2 )){
					newHit = true;
					c2.collidingTime = frameCount;
					c2.colliding = true;

					c.collidingTime = frameCount;
					c.colliding = true;
				}
			}

			if( !newHit ){
				c.colliding = false;
			}*/
		}
    }

    void selectCell(){
		Cell c = cells.get(int(random(cells.size())));
		c.select();
    }
	
	void awake() {
		sleeping = false;
		for (int i=0; i<cells.size(); i++) {
			Cell c = cells.get(i);
			c.sleeping = false;
			c.wakeupTime = frameCount;
			c.tarLocation = new PVector(random(width),random(height));
		}
	}

	void sleep() {
		sleeping = true;
		for (int i=0; i<cells.size(); i++) {
			Cell c = cells.get(i);
			c.sleeping = true;
		}
	}
}