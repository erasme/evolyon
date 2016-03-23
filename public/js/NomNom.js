var colorsNomNom = [
  "255,119,87",
  "255,194,95",
  "255,255,255",
  "247,105,136",
  "190,183,196",
  "234,181,244"
];

// 13,255,255
// 161,132,183




function NomNom(i) {

  this.i = i;
  this.x; 
  this.y; 
  this.r;
  this.scale;
  this.found;
  this.opacity;
  this.alive;
  
  this.init = function() {
    this.x = random(width-50)+25;
    this.y = random(height-50)+25;
    this.r = random(5, 10);
    this.scale = 1;
    this.found = false;
    this.opacity = 1;
    this.alive = true;
    this.color = colorsNomNom[parseInt(Math.random()*(colorsNomNom.length-1))];
  }
  
  this.update = function() {
    if (this.alive) {
      if (this.isCollidingWithTriangle() == true) {
        this.found = true;
        triangle.color = this.color;
      }
      
      if (this.found) {
        this.r += .5;
        this.opacity -= .08;
      }
      
      
      if (this.opacity <= 0.1) {
        this.init();
      }
    }
  }

  this.draw = function() {
    if (this.alive) {
    
      push();
      
      translate(this.x, this.y);
      scale(this.scale * (sin(frameCount*bounceSpeed/60.)*0.2+1), this.scale * (sin(frameCount*bounceSpeed/60.)*0.2+1));
        
      fill('rgba('+this.color+','+this.opacity+')');     
      
      
      noStroke();
      
      rotate(this.rotate);
      
      ellipseMode(CENTER);
      ellipse(-this.r, -this.r, this.r*2, this.r*2);
  
      pop();
    }
    
  }
  
  this.isCollidingWithTriangle = function() {
    return (dist(this.x, this.y, triangle.x, triangle.y) < this.r + 30);
  }
  
} 

