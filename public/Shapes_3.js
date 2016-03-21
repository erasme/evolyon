var isWeb = false;
var triangle;

var threshold = 30;
var accChangeX = 0; 
var accChangeY = 0;
var accChangeT = 0;

var backgroundOpacity = 0;
var bounceSpeed = 0;

var nomnoms = [];


function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('particle');
  triangle = new Triangle();
  
  for (var i = 0; i <= 5; i++) {
    newNomNom();
  }
  
//  size(window.innerWidth, window.innerHeight, P3D);
  smooth();
}

function draw(event) {
  background('rgb(36,31,56)');
  
  if (backgroundOpacity > .1) {
    fill('rgba(255,33,124,'+backgroundOpacity+')');
    rect(0,0,width,height);
  }
  
  canvasUpdate();
  
  for (var i = 0; i < nomnoms.length; i++) {
    nomnoms[i].update();
    nomnoms[i].draw();
  }
  
  triangle.move();
  triangle.draw();
  
//  checkForShake();
}

function mousePressed(){
  triangle.update();
}

function touchStarted(){
}

function touchMoved(){
  triangle.update();
  return false;
}

function mouseDragged(){
  triangle.update();
}

function newNomNom() {
  var i = nomnoms.length;
  nomnoms[i] = new NomNom(i);
  nomnoms[i].init();
}

function canvasUpdate() {
  if (backgroundOpacity >= 0) {
    backgroundOpacity -= .05;
  }
  if (bounceSpeed >= 1) {
    bounceSpeed -= 1;
  }
  if (triangle.scale >= 1) {
    triangle.scale -= .03;
  }
}

function setBounceEffect() {
  navigator.vibrate(20);
  backgroundOpacity = .5;
  bounceSpeed = 50;
  triangle.scale = 1.7;
}
/*
function checkForShake() {
  // Calculate total change in accelerationX and accelerationY
  accChangeX = abs(accelerationX - pAccelerationX);
  accChangeY = abs(accelerationY - pAccelerationY);
  accChangeT = accChangeX + accChangeY;
  // If shake
  if (accChangeT >= threshold) {
    triangle.shake();
    triangle.turn();
  } 
  // If not shake
  else {
    triangle.stopShake();
    triangle.turn();
    triangle.move(); 
  }
}
*/


function polygon(centreX, centreY, nbCotes, radius, angle, amplitude) {
  var pos = [nbCotes];
  for (var i=0; i<nbCotes; i++) {
    pos[i] = createVector( cos(radians(angle + 360./nbCotes * i)) * radius, sin(radians(angle + 360./nbCotes * i)) * radius);
  }


  var middles = [nbCotes];
  for (var i=0; i<nbCotes; i++) {
    middles[i] = createVector( (pos[ i ].x + pos[ (i+1) % nbCotes ].x ) / 2, (pos[ i ].y + pos[ (i+1) % nbCotes ].y ) / 2);
    middles[i].mult(amplitude);
  }

  beginShape();
  for (var i=0; i<nbCotes; i++) {
    vertex(centreX+pos[i].x, centreY+pos[i].y);
    vertex(centreX+middles[i].x, centreY+middles[i].y);
  }
  endShape(CLOSE);
}

