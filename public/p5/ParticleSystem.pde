class ParticleSystem {
    ArrayList<Cell> cells;

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

            Cell c = cells.get(i);
            c.run();

            if (c.isDead()) {
                cells.remove(i);
            }

			boolean newHit = false;

			for ( int j=i-1; j >= 0; j-- ) {
				Cell c2 = cells.get( j );
				if(c.collideEqualMass( c2 )){
					newHit = true;
					c2.isColliding = true;
				}
			}

			if( !newHit ){
				c.colliding = false;
			}
			else{
				c.isColliding = true;
			}
		}
    }


	
	/*void awake() {
	  for (int i=0; i<cells.size(); i++) {
		  Cell c = cells.get(i);
		  c.raise();
	  }
	  // frameDrop = frameCount;
	}

	void sleep() {
		for (int i=0; i<cells.size(); i++) {
			Cell c = cells.get(i);
			c.drop();
		}
	}*/
	
}