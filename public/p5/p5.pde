int NB_CELLS = 2; // init cell numbers
ArrayList<Cell> cells = new ArrayList<Cell>();

void setup() {
  size(500, 500);
  noFill();

  stroke(#a184b7);
  strokeWeight(2);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  smooth();

  for (int i=0; i<NB_CELLS; i++) {
    cells.add( getNewCell(width/2, height/2) );
  }
}

Cell getNewCell(int x, int y) {
  Cell c = new Cell(x, y, 3, 50, -90, sin(frameCount/40.)*0.2+1);
  return c;
}

void draw() {
  background(0);

  for (int i=0; i<cells.size(); i++) {
    Cell c = cells.get(i);
    if (c.rayon == 0) { // remove cell if the radius is 0
      cells.remove(i);
    } else {
      c.move();
    }
  }
}

boolean dropped = false;
void sleepAwakeAll() {
  if (dropped) {
    for (int i=0; i<cells.size(); i++) {
      Cell c = cells.get(i);
      c.drop();
    }
    dropped = false;
  } else  {
    for (int i=0; i<cells.size(); i++) {
      Cell c = cells.get(i);
      c.raise();
    }
    dropped = true;
  }
}


void keyPressed() {
  Cell c = cells.get(int(random(cells.size())));
  if (key == 'a') {
    sleepAwakeAll();
  } else if (key == 'z') {
    c.kick();
  } else if (key == 'e') {
    c.disappear();
  } else if (key == 'r') {
    // add 2 cells
    c.disappear();
    cells.add( getNewCell(c.centreX, c.centreY) );
    cells.add( getNewCell(c.centreX, c.centreY) );
  } else if (key == 't') {
    c.cellRayon=c.cellRayon+10;
  }
}
