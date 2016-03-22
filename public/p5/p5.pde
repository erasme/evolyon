int NB_CELLS = 50; // init cell numbers
ArrayList<Cell> cells = new ArrayList<Cell>();
boolean sleeping = false;
int frameDrop;

void setup() {
    size(w, h);
    noFill();

    smooth();

    // init cells
    for (int i=0; i<NB_CELLS; i++) {
        cells.add( getNewCell() );
    }
    sleepAll();
}

Cell getNewCell() {
    float x = random(0, width);
    float y = random(0, height);

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
    return c;
}


void draw() {
    background(#241f38);

    for (int i=0; i<cells.size(); i++) {
        Cell c = cells.get(i);
        boolean newHit = false;

        if (c.rayon == 0) { // remove cell if the radius is 0
            cells.remove(i);
        } else {
            c.move();
            c.draw();
        }


        // hit test
        if (!c.dropped && frameCount > frameDrop+50 ) {
            for (int j=i+1; j<cells.size(); j++) {
                Cell c2 = cells.get(j);
                if ( hitTest(c, c2) ) {
                    newHit = true;
                    if (c.isHit) {
                        if (random(1) > .5) {
                            c.onCollision(c2);
                        } else {
                            c2.onCollision(c);
                        }
                    }
                    c.isHit = true;
                    c2.isHit = true;
                }
            }
        }
        if (!newHit) c.isHit = false;
    }
}


void awakeAll() {
  for (int i=0; i<cells.size(); i++) {
      Cell c = cells.get(i);
      c.raise();
  }
  frameDrop = frameCount;
}

void sleepAll() {
  for (int i=0; i<cells.size(); i++) {
      Cell c = cells.get(i);
      c.drop();
  }
}

void emitCell() {
  Cell c = cells.get(int(random(cells.size())));
  console.log("emitCell")
  // animate cell
  socket.emit("emitCell", {
    "nbCotes" : c.nbCotes,
    "r" : c.r,
    "color" : c.couleur
  });
}

void keyPressed() {
  Cell c = cells.get(int(random(cells.size())));
  if (key == 'a') {
    sleepAwakeAll();
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
  cells.add( getNewCell() );
}

float squareDist(Cell c1, Cell c2) {
    return (c1.centreX - c2.centreX)*(c1.centreX - c2.centreX) + (c1.centreY - c2.centreY)*(c1.centreY - c2.centreY);
}

boolean hitTest(Cell c1, Cell c2) {
    // println(squareDist(c1, c2), c1.rayon*c2.rayon);
    if (squareDist(c1, c2) < (c1.rayon*1.8)*(c2.rayon*1.8) ){
        return true;
    } else {
        return false;
    }
}
