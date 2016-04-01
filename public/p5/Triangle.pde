class Triangle extends Cell {

    Triangle(float x, float y) {
        super(x, y, 3, int(random(360)), sin(frameCount/40.)*0.2+1 );
    }
}