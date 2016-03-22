 int x;
 int y;
 int a=1;
 int b=1;
 int speed =1;
 
 int NB_CELLULES = 10;
  
void setup() {
  size(500, 500);
  noFill();
  strokeJoin(ROUND);
  strokeCap(ROUND);
  smooth();
}

int trajectoireX;
int trajectoireY;
 
void draw() {
  background(#241f38);

  stroke(#a184b7);
  strokeWeight(3);
  int taille = 50;
  
 if( frameCount % 100  == 0 ){
   println("change direction");
   trajectoireX = int(random (taille, width-taille));
   trajectoireY = int(random (taille, height-taille));
   
 }
 
 x = ease(x, trajectoireX, 0.02 );
 y = ease(y, trajectoireY, 0.02 );
     
   drawPolygon(x, y, 8, taille, -90, sin(frameCount/40.)*0.1+1, true);
  
}
 
void mousePressed(){
  if (speed ==1){
    speed = 4;
  } else {
    speed=1;
  }
}

int ease(int value, int target, float easingVal) {
  int d = target - value;
  if (abs(d)>1) value+= d*easingVal;
  return int(value);
}

void drawPolygon(
     // Définition des variables
    int centreX, 
    int centreY, 
    int nbCotes, 
    int rayon,
    float angle, 
    float amplitude,
    boolean bordRond
    )
     {
       


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
  curveTightness(0.1);
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
