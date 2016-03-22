int NB_CELLS = 20; // init cell numbers
ArrayList<Cell> cells = new ArrayList<Cell>();

void setup() {
  size(500, 500);
  noFill();

  smooth();

  for (int i=0; i<NB_CELLS; i++) {
    cells.add( getNewCell(width/2, height/2) );
  }
}

Cell getNewCell(int x, int y) {
  Cell c = new Cell(x, y, int(random(3, 6)), 10, int(random(360)), sin(frameCount/40.)*0.2+1);
  return c;
}

void draw() {
  background(#241f38);

  for (int i=0; i<cells.size(); i++) {
    Cell c = cells.get(i);
    if (c.rayon == 0) { // remove cell if the radius is 0
      cells.remove(i);
    } else {
      c.move();
    }

    for (int j=i+1; j<cells.size(); j++) {
        Cell c2 = cells.get(j);
        if ( hitTest(c, c2) ){
          // println(frameCount, "hhhiiiiiitt");
          // c.trajectoireX = c.trajectoireX*-1;
          // c.trajectoireY = c.trajectoireY*-1;
          // c2.trajectoireX = c2.trajectoireX*-1;
          // c2.trajectoireY = c2.trajectoireY*-1;
          // c.kick();
          // c2.kick();
      }
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

float squareDist(Cell c1,Cell c2){
  return float( (c1.centreX - c2.centreX)*(c1.centreX - c2.centreX) + (c1.centreY - c2.centreY)*(c1.centreY - c2.centreY));
}

boolean hitTest(Cell c1,Cell c2) {
  // println(squareDist(c1, c2), c1.rayon*c2.rayon);
  if (squareDist(c1, c2) < c1.rayon*c2.rayon) {
    return true;
  } else {
    return false;
  }
}
