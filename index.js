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
  return {x : randomInt(0, 600), y : randomInt(0,600) }
})

// console.log(cells);

ootsidebox.on('open', function(){
  console.log('Serial Port Opend');

  io.on( 'connection', function( socket ) {

      console.log("connected");

      socket.emit('cells', cells)


        ootsidebox.write("V\n", function(err, results) {
          console.log('err ' + err);
          console.log('results ' + results);
        });

        ootsidebox.on('data', function(data){
          var raw = data.split("|");
          var gesture = {
            x : parseInt(raw[4]),
            y : parseInt(raw[5]),
            z : parseInt(raw[6])
          }

          socket.emit("gesture", gesture);
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
