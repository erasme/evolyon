int NB_CELLS = 10; // init cell numbers
ArrayList<Cell> cells = new ArrayList<Cell>();

void setup() {
  size(500, 500);
  noFill();

  smooth();

  for (int i=0; i<NB_CELLS; i++) {
    cells.add( getNewCell() );
  }
}

Cell getNewCell() {
  int x =int( random(0, width));
  int y = int(random(0,height));

  Cell c = new Cell();
  int cellType = int(random(3));
  println(cellType);
  switch(cellType) {
    case 0 :
      c = new Triangle(x, y);
      break;
    case 1 :
      c = new Square(x, y);
      break;
    case 2 :
      c=  new Blob(x, y);
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
    }

    for (int j=i+1; j<cells.size(); j++) {
        Cell c2 = cells.get(j);
        if ( hitTest(c, c2) ){
          newHit = true;
          if(c.isHit) {
            if(random(1) > .5) {
              c.onCollision(c2);
            } else {
              c2.onCollision(c);
            }
          }
          c.isHit = true;
          c2.isHit = true;
      }
    }
    if(!newHit) c.isHit = false;


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
  } else if (key == 't') {
    c.cellRayon=c.cellRayon+10;
  } else if (key == ' ') {
    c.kick();
  } else if (key == 'w') {
    int x =int( random(0, width));
    int y = int(random(0,height));
    c = new Triangle(x, y);
    cells.add(c);
  } else if (key == 'x') {
      int x =int( random(0, width));
      int y = int(random(0,height));
      c = new Square(x, y);
      cells.add(c);
  } else if (key == 'c') {
      int x =int( random(0, width));
      int y = int(random(0,height));
      c = new Blob(x, y);
      cells.add(c);
  }
}

void split(){
  cells.add( getNewCell() );
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
