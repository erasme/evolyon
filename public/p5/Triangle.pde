class Triangle extends Cell {

    Triangle(float x, float y) {
        super(x, y, 3, int(random(360)), sin(frameCount/40.)*0.2+1 );
    }

    void onCollision(Cell targetCell) {
        targetCell.disappear();
    }

    void draw() {
        stroke(couleur, 40);
        strokeWeight(5);
        polygon(centreX, centreY, 3, rayon, angle, 1, true);

        stroke(couleur, 30);
        strokeWeight(12);
        polygon(centreX, centreY, 3, rayon, angle, 1, true);

    	if( isHit ) fill(couleur, 100);
        stroke(couleur);
        strokeWeight(2);
        polygon(centreX, centreY, 3, rayon, angle, 1, true);
        if(isHit) noFill();
    }
}