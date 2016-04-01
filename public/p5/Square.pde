class Square extends Cell {
    Square(float x, float y) {
        super(x, y, 4, int(random(360)), sin(frameCount/40.)*0.2+1 );
    }
}