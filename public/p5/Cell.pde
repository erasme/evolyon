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

  color couleur;


  Cell(int centreX_, int centreY_, int nbCotes_, int rayon_, float angle_, float amplitude_, color couleur_) {
    centreX = centreX_;
    centreY = centreY_;
    nbCotes = nbCotes_;
    rayon = 1;
    angle = angle_;
    amplitude = amplitude_;

    cellRayon = rayon_;

    cellEasing = random(0, 0.05);
    easing = cellEasing;

    delay = int(random(5,100));
    dropped = false;

    // init creation
    appearing = true;

    couleur =couleur_;

  }

  void drop() {
    dropped = true;
  }

  void raise() {
    dropped = false;
  }

  boolean kicked = false;
  int originKicked;
  int kickDuration = 150;

  void kick() {
    originKicked = frameCount;
    kicked = true;
  }

  boolean disappearing = false;
  void disappear() {
    disappearing = true;
  }

  void move() {

    if( dropped == true ){
      trajectoireX = centreX;
      if ( frameCount % delay  == 0 ) {
        trajectoireY = int( random(height-rayon, height) );
      }
    } else if ( frameCount % delay  == 0 ) {
      trajectoireX = int(random (rayon, width-rayon));
      trajectoireY = int(random (rayon, height-rayon));
    }


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

    stroke(couleur);
    strokeWeight(2);
    strokeJoin(ROUND);
    strokeCap(ROUND);

    PVector[] pos = new PVector[nbCotes];

    // La forme s'inscrit dans un cerlce (radians : en degrès)
    for (int i=0; i<nbCotes; i++) {
      pos[i] = new PVector( cos(radians(angle + 360./nbCotes * i)) * rayon, sin(radians(angle + 360./nbCotes * i)) * rayon);
    }

    // Trouver les milieux des sommets
    PVector[] middles = new PVector[nbCotes];

    // Prendre le centre de tous les sommets (pos)
    for (int i=0; i<nbCotes; i++) {
      middles[i] = new PVector( (pos[ i ].x + pos[ (i+1) % nbCotes ].x ) / 2, (pos[ i ].y + pos[ (i+1) % nbCotes ].y ) / 2);
      middles[i].mult(amplitude);
    }

    // Dessiner à partir du premier point, et venir fermer la forme au point d'origine
    beginShape();
    for (int i=0; i<nbCotes; i++) {
      vertex(centreX+pos[i].x, centreY+pos[i].y);
      vertex(centreX+middles[i].x, centreY+middles[i].y);
    }

    endShape(CLOSE);
  }
}
