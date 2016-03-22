class Blob extends Cell {
    Blob(float x, float y) {
        super(x, y, 8, int(random(360)), sin(frameCount/40.)*0.2+1 );
    }

    void onCollision(Cell targetCell) {
        if (random(1) < 0.05) {
            split();
        }
    }

    void draw() {
        stroke(couleur, 30);
        strokeWeight(8);
        polygon(centreX, centreY, 8, rayon, angle, sin(frameCount/60.)*0.1+1, true);
        
        stroke(couleur, 20);
        strokeWeight(12);
        polygon(centreX, centreY, 8, rayon, angle, sin(frameCount/60.)*0.1+1, true);

    	if( isHit ) fill(couleur, 100);
        stroke(couleur);
        strokeWeight(2);
        polygon(centreX, centreY, 8, rayon, angle, sin(frameCount/60.)*0.1+1, true);
        if(isHit) noFill();
    }
}