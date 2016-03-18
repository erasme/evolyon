var express = require( 'express' );
var app = express( );
var server = require( 'http' ).createServer( app );
var io = require( 'socket.io' )( server );
var port = process.env.PORT || 3010;

var config = require("./config");
//
// var CaressServer = require('caress-server');
// var caress = new CaressServer('0.0.0.0', 3333, {json: true});

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var ootsidebox = new SerialPort("/dev/ttyACM0", { baudrate: 115200, parser: serialport.parsers.readline("\n") } );


app.get('/', function(req, res) {
  res.sendfile('public/index.html');
})

app.get('/touchscreen', function(req, res) {
  res.send('Touchscreen');
})

app.get('/videoproj', function(req, res){
  res.send('Videoproj');
})

app.get('/single/:id', function(req,res){
  res.send('cell ' + req.params.id);
});

server.listen( port, function( ) {
    console.log( 'Server listening at port %d', port );
});

app.use( express.static( __dirname + '/public' ) );

// generate cells
var NB_CELLS = 45;

var cells = Array.apply(null, Array(NB_CELLS)).map(function(d,i){
  return {x : randomInt(0, 600), y : randomInt(0,600), easing: randomInt(1,100)/100, delay: randomInt(50, 300) }
})

// console.log(cells);

var prevGest= {x:0, y:0, z:0, ts: Date.now()};
var ootsideboxActive = false;
var moveEventTime = null;
var currentEvent = null;
var eventSent = false;

function sendRawInstructions() {
  ootsidebox.write("V", function(err, results) {
    if (err) console.log('err ' + err);
    console.log('results ' + results);
  });
}


var POS_LENGTH = 10
var AXIS_AVG_MEDIUM = { x: 45, y: 45, z : 150}; // calibrate


var prevPos = new Array(POS_LENGTH);

function addPrevPos(x, y, z) {
  prevPos.unshift({x:x, y:y, z:z }); // prepend value to array
  prevPos.pop();
  // console.log(prevPos.length == POS_LENGTH); // TODO : assert
}

function getDiff(axis) {

  var values = prevPos.map(function(d) { return d[axis] });

  var sum = values.reduce(function(a, b) { return a + b; });
  var avg = sum / values.length;

  var diff = values.reduce(function(a, b) {
    return avg*2 - (a+b);
  });

  return parseInt(diff)
}

var vals = []
ootsidebox.on('open', function(err){
  console.log('Serial Port Open : Ootsidebox');

  io.on( 'connection', function( socket ) {
      console.log("connected");
      sendRawInstructions(); // init raw values

      socket.emit('cells', cells)

      ootsidebox.on('data', function(data, err){

        var raw = data.split("|");

        if (raw.length == 1) sendRawInstructions(); // make sure the V is sent

        var x = parseInt(raw[4]),
            y = parseInt(raw[5]),
            z = parseInt(raw[6]),
            ts = Date.now();

        addPrevPos(x,y,z);

        // EVENTS
        var diffX = getDiff("x"),
          diffY = getDiff("y"),
          diffZ = getDiff("y");


        // check if there is an important difference in any value
        if (diffX || diffY  || diffZ ) {

          // get the biggest difference
          var axis = ["x", "y", "z"];
          var maxs = [diffX, diffY, diffZ];
          var max = Math.max(diffX, diffY, diffZ);
          console.log(axis[maxs.indexOf(max)]);
          // console.log(axis[iMax]);
          // var iMax = [diffX, diffY, diffZ].indexOf(Math.max.apply(Math, [diffX, diffY, diffZ]));

        }


        //
        //
        // if(diffZ > 1 && diffZ < -1) console.log(diffZ);

        var moveEvent = undefined;

        // hit event
        if(diffZ > 6 && diffX < 2  && diffX > -2 && diffY < 2  && diffY > -2 ) moveEvent = "hit";

        // shake event
        if(diffZ < 4  && diffZ > -4  &&diffY > 10) moveEvent = "up";
        // if(diffY > 10) moveEvent ="left";
        // if(diffY < -10) moveEvent ="right";

        // if there is a change, record new event
        if(moveEvent && !currentEvent ) {
          moveEventTime = ts;
          currentEvent = moveEvent;
        }

        // keep the event alive for 1s
        if(ts < (moveEventTime+1000) ) {
          if(!eventSent) {
            console.log(moveEvent);
            socket.emit(moveEvent, "gesture");
            eventSent = true;
          }
        } else {
          currentEvent = null;
          eventSent = false;
        }

        //
        if ( diffZ < 2 && diffY < 2 && diffX < 2)
          ootsideboxActive = false;
        else
          ootsideboxActive = true;

        var gesture = {
          x : x,
          y : y,
          z : z,
          active: ootsideboxActive,
          ts : ts
        }

        socket.emit("gesture", gesture);
        prevGest = gesture;

      });


      socket.on( 'click', function( data ) {
      	   console.log('click', data);
          socket.broadcast.emit( 'new click', data );
      });

    // when the user disconnects.. perform this
    socket.on( 'disconnect', function( ) {
    } );

  });

} );

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

Array.prototype.max = function() {
  return Math.max.apply(Math, this);
};

Array.prototype.min = function() {
  return Math.min.apply(Math, this);
};
