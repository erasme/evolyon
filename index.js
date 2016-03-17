var express = require( 'express' );
var app = express( );
var server = require( 'http' ).createServer( app );
var io = require( 'socket.io' )( server );
var port = process.env.PORT || 3010;

var config = require("./config");

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

console.log(cells);

io.on( 'connection', function( socket ) {

    console.log("connected");

    socket.emit('cells', cells)

    socket.on( 'click', function( data ) {
    	console.log('click', data);
        socket.broadcast.emit( 'new click', data );
    });

    // when the user disconnects.. perform this
    socket.on( 'disconnect', function( ) {
    } );
} );

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
