class Blob extends Cell {
    Blob(float x, float y) {
        super(x, y, 8, int(random(360)), sin(frameCount/40.)*0.2+1 );
    }
}