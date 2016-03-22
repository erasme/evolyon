/*
        ____                            __                _
       / __ \___  ____  ___  ____  ____/ /__  ____  _____(_)__  _____
      / / / / _ \/ __ \/ _ \/ __ \/ __  / _ \/ __ \/ ___/ / _ \/ ___/
     / /_/ /  __/ /_/ /  __/ / / / /_/ /  __/ / / / /__/ /  __(__  )
    /_____/\___/ .___/\___/_/ /_/\__,_/\___/_/ /_/\___/_/\___/____/
              /_/
*/
var express = require( 'express' );
var app = express();
var server = require( 'http' ).createServer( app );
var io = require( 'socket.io' )( server );
var port = process.env.PORT || 3010;

var config = require( "./config" );


/*
        ____              __  _
       / __ \____  __  __/ /_(_)___  ____ _
      / /_/ / __ \/ / / / __/ / __ \/ __ `/
     / _, _/ /_/ / /_/ / /_/ / / / / /_/ /
    /_/ |_|\____/\__,_/\__/_/_/ /_/\__, /
                                  /____/
*/
app.use( express.static( __dirname + '/public' ) );

app.get( '/', function( req, res ) {
    res.sendfile( 'public/single.html' );
} );

app.get( '/cells/', function( req, res ) {
    // res.send('cell ' + req.params.id);
    res.sendfile( 'public/cells.html' );
} );


server.listen( port, function() {
    console.log( 'Server listening at port %d', port );
});



/*
       _____            __        __    _
      / ___/____  _____/ /_____  / /_  (_)___
      \__ \/ __ \/ ___/ //_/ _ \/ __/ / / __ \
     ___/ / /_/ / /__/ ,< /  __/ /__ / / /_/ /
    /____/\____/\___/_/|_|\___/\__(_)_/\____/
*/
io.on( 'connection', function( socket ) {
    console.log( "socket connected" );

    // when the user disconnects.. perform this
    socket.on( 'disconnect', function() {
        console.log( "bye !" );
    } );
} );
