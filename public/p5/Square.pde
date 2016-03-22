class Square extends Cell {
    Square(float x, float y) {
        super(x, y, 4, int(random(360)), sin(frameCount/40.)*0.2+1 );
    }

    void onCollision(Cell targetCell) {
        targetCell.kick();
    }

    void draw() {

        stroke(couleur, 30);
        strokeWeight(8);
        polygon(centreX, centreY, 6, rayon, angle, 1, false);

        stroke(couleur, 20);
        strokeWeight(12);
        polygon(centreX, centreY, 6, rayon, angle, 1, false);
        
    	if( isHit ) fill(couleur, 100);
        stroke(couleur);
        strokeWeight(2);
        polygon(centreX, centreY, 6, rayon, angle, 1, false);
        if(isHit) noFill();
    }
}