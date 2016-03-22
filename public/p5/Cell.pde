final static float SPEED = 0.0005;
final static int RADIUS_MAX = 20;

class Cell {

  int centreX;
  int centreY;
  int trajectoireX;
  int trajectoireY;
  int nbCotes;
  int rayon;
  float angle;
  float amplitude;
  int delay;
  boolean dropped;

  float easing;
  float cellEasing; // backup the values

  int cellRayon;
  boolean appearing;

  boolean isHit = true;

  color couleur;

  Cell() {
    // empy
  }

  Cell(int centreX_, int centreY_, int nbCotes_, float angle_, float amplitude_) {
    centreX = centreX_;
    centreY = centreY_;
    nbCotes = nbCotes_;
    rayon = int( random(15, RADIUS_MAX));
    angle = angle_;
    amplitude = amplitude_;

    cellRayon = rayon;

    cellEasing = random(0, SPEED);
    easing = cellEasing;

    delay = int(random(75,100));
    dropped = false;

    // init creation
    appearing = true;

    // couleur
    if(nbCotes_ == 3) {
      couleur = color(#ff217c);
    } else if(nbCotes_ == 4) {
      couleur = color(#0dffe1);
    } else {
      couleur = color(#a184b7);
    }
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

    if( dropped == true ){
      trajectoireX = centreX;
      trajectoireY = int( random(height-rayon, height) );
    } else if ( frameCount % delay  == 0 ) {
      trajectoireX = int(random (rayon, width-rayon));
      trajectoireY = int(random (rayon, height-rayon));
    }

    // trajectoireX = constrain(trajectoireX, 0, width);
    // trajectoireY = constrain(trajectoireY, 0, height);


    if (kicked) {
      easing = .3;

      // println(frameCount - originKicked, originKicked);
      if( frameCount - originKicked == kickDuration) {
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
    } else  {
      appearing = false;
    }

    if(disappearing || appearing) {

    } else  {
      centreX  = ease(centreX, trajectoireX, easing );
      centreY = ease(centreY, trajectoireY, easing);
    }


    draw();
  }

  int ease(int value, int target, float easingVal) {
    int d = target - value;
    if (abs(d)>1) value+= d*easingVal;
    return int(value);
  }



  void draw() {
    polygon(centreX, centreY, 6, rayon, angle, 1, false);
  }

  void polygon(int centreX, int centreY, int nbCotes, int radius, float angle, float amplitude, boolean bordRond) {
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
        }
        else {
          vertex(centreX+pos[i].x, centreY+pos[i].y);
          vertex(centreX+middles[i].x, centreY+middles[i].y);
        }
      }
      endShape(CLOSE);
    }

  void onCollision(Cell targetCell){

  }

}


class Triangle extends Cell {

  Triangle(int x, int y){
    super(x, y, 3, int(random(360)), sin(frameCount/40.)*0.2+1 );
  }

  void onCollision(Cell targetCell){
      targetCell.disappear();
  }

  void draw() {
    stroke(#ff217c);
    strokeWeight(2);
    polygon(centreX, centreY, 3, rayon, angle, 1, true);

    stroke(#ff217c, 40);
    strokeWeight(5);
    polygon(centreX, centreY, 3, rayon, angle, 1, true);

    stroke(#ff217c, 30);
    strokeWeight(12);
    polygon(centreX, centreY, 3, rayon, angle, 1, true);

  }

}

class Square extends Cell {
  Square(int x, int y){
    super(x, y, 4, int(random(360)), sin(frameCount/40.)*0.2+1 );
  }

  void onCollision(Cell targetCell){
      targetCell.kick();
  }

  void draw(){
    stroke(#0dffe1);
    strokeWeight(2);
    /*centre>bas*/
    // line(centreX, centreY, 400, 450);
    /*centre>droite*/
    // line(centreX, centreY, 444, 376);
    /*centre>gauche*/
    // line(centreX, centreY, 355, 376);
    /*hexagone autour*/
    polygon(centreX, centreY, 6, rayon, angle, 1, false);

    /*hexagone autour*/
    stroke(#0dffe1, 30);
    strokeWeight(8);
    polygon(centreX, centreY, 6, rayon, angle, 1, false);
    /*hexagone autour*/
    stroke(#0dffe1, 20);
    strokeWeight(12);
    polygon(centreX, centreY, 6, rayon, angle, 1, false);
  }
}

class Blob extends Cell {
  Blob(int x, int y){
    super(x, y, 8, int(random(360)), sin(frameCount/40.)*0.2+1 );
  }

  void onCollision(Cell targetCell){
    if(random(1) < 0.05){
    split();
    }
  }

  void draw(){
    stroke(#a184b7);
    strokeWeight(2);
    polygon(centreX, centreY, 8, rayon, angle, sin(frameCount/60.)*0.1+1, true);
    stroke(#a184b7, 30);
    strokeWeight(8);
    polygon(centreX, centreY, 8, rayon, angle, sin(frameCount/60.)*0.1+1, true);
    stroke(#a184b7, 20);
    strokeWeight(12);
    polygon(centreX, centreY, 8, rayon, angle, sin(frameCount/60.)*0.1+1, true);
  }
}
