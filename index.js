var express = require( 'express' );
var app = express( );
var server = require( 'http' ).createServer( app );
var io = require( 'socket.io' )( server );
var port = process.env.PORT || 3000;

var config = require("./config");


app.use( express.static( __dirname + '/public' ) );

io.on( 'connection', function( socket ) {

    console.log("connected");

    socket.on( 'click', function( data ) {
    	console.log('click', data);
        socket.broadcast.emit( 'new click', data );
    } );

    // when the user disconnects.. perform this
    socket.on( 'disconnect', function( ) {
    } );
} );
