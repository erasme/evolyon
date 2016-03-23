function Triangle(_nbCotes, _couleur, _rayon) {

  // Speed - Velocity
  this.vx = 0;
  this.vy = 0;

  // Acceleration
  this.ax = 0;
  this.ay = 0;

  this.vMultiplier = 0.007;
  this.bMultiplier = 0.8;

  this.x = width/2;
  this.y = height/2;
  this.diameter = random(10, 30);
  this.xspeed = random(-2, 2);
  this.yspeed = random(-2, 2);
  this.oxspeed = this.xspeed;
  this.oyspeed = this.yspeed;
  this.direction = 0.7;
  this.rotate = 0;
  this.scale = 1;


  this.nbCotes = _nbCotes;
  this.color = _couleur || "255,33,124";
  this.r = _rayon;


  this.update = function(event) {
    this.x = touchX;
    this.y = touchY;
  }

  this.move = function() {
  	this.x = constrain( this.x, this.r, width - this.r );
  	this.y = constrain( this.y, this.r, height - this.r );
    this.rotate += this.vx/2000;

    if (this.rotate >= 360) {
      this.rotate = 0;
    }

    this.ax = rotationX;
  	this.ay = rotationY;

  	this.vx = this.vx + this.ay + accelerationY*2;
  	this.vy = this.vy + this.ax + accelerationX*2;

  	this.y = this.y + this.vy * this.vMultiplier;
  	this.x = this.x + this.vx * this.vMultiplier;

  	// Bounce when touch the edge of the canvas
  	if (this.x < 0) {
  		this.x = 0;
  		this.vx = -this.vx * this.bMultiplier;
  		setBounceEffect();
  	}
   	if (this.y < 0) {
   		this.y = 0;
   		this.vy = -this.vy * this.bMultiplier;
  		setBounceEffect();
   	}
   	if (this.x > width - 20) {
   		this.x = width - 20;
   		this.vx = -this.vx * this.bMultiplier;
  		setBounceEffect();
   	}
   	if (this.y > height - 20) {
   		this.y = height - 20;
   		this.vy = -this.vy * this.bMultiplier;
  		setBounceEffect();
   	}
  }

  this.draw = function() {
    noFill();
    strokeJoin(ROUND);
    strokeCap(ROUND);

    push();
    angleMode(DEGREES);
    translate(this.x, this.y);
    rotate(this.rotate);
    angleMode(RADIANS);
    scale(this.scale, this.scale);



    stroke('rgb('+this.color+')'); // Demander à avoir les couleurs en "xxx,xxx,xxx" pour ajouter alpha ensuite
    strokeWeight(3);
    polygon(random(-1, 1), random(-1, 1), this.nbCotes, this.r, -90, (sin(frameCount*bounceSpeed/60.)*0.2+1) );

    stroke('rgba('+this.color+',.3)');
    strokeWeight(10);
    polygon(random(-1, 1), random(-1, 1), this.nbCotes, this.r, -90, sin(frameCount*bounceSpeed/60.)*0.2+1);

    stroke('rgba('+this.color+',.2)');
    strokeWeight(20);
    polygon(random(-1, 1), random(-1, 1), this.nbCotes, this.r, -90, sin(frameCount*bounceSpeed/60.)*0.2+1);

    pop();
  }

  // Bounce when touch the edge of the canvas
  /*
  this.turn = function() {
    if (this.x < 0) {
      this.x = 0;
      this.direction = -this.direction;
    }
    else if (this.y < 0) {
      this.y = 0;
      this.direction = -this.direction;
    }
    else if (this.x > width - 20) {
      this.x = width - 20;
      this.direction = -this.direction;
    }
    else if (this.y > height - 20) {
      this.y = height - 20;
      this.direction = -this.direction;
    }
  }
  */
  /*
  this.shake = function() {
    this.xspeed += random(5, accChangeX/6);
    this.yspeed += random(5, accChangeX/6);
  }

  this.stopShake = function() {
    if (this.xspeed > this.oxspeed) {
      this.xspeed -= 0.6;
    }
    else {
      this.xspeed = this.oxspeed;
    }
    if (this.yspeed > this.oyspeed) {
      this.yspeed -= 0.6;
    }
    else {
      this.yspeed = this.oyspeed;
    }
  }*/
}
