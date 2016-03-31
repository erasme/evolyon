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
var port = process.env.WEB_PORT || 3010;
var path = require('path');

var config = require( "./config" );
var redisHost = config.redisHost || "127.0.0.1";
var redisPort = config.redisPort || "6379";

var redis = require("redis");
var redisPhone = redis.createClient(redisPort, redisHost);
var redisCell = redis.createClient(redisPort, redisHost);
redisPhone.on('connect', function() {
    console.log('Redis client (redisPhone) connected on '+ redisHost+":"+ redisPort);
});


// listen to cell phone activty
redisCell.on('connect', function() {
    console.log('Redis client (redisCell) connected on '+ redisHost+":"+ redisPort);
});

// subscribe to redis
redisCell.subscribe("evolyonCell");
redisCell.on("message", function(channel, message){
  //pop off new item
  console.log("new cell");
  console.log(channel, message);
  io.emit("newCell", JSON.parse(message))
  phoneReady = true;
});


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
    res.sendFile( path.join(__dirname, 'public', 'single.html') );
} );

app.get( '/cells/', function( req, res ) {
    // res.send('cell ' + req.params.id);
    res.sendFile( path.join(__dirname, 'public', 'cells.html') );
} );

app.get( '/mire/', function( req, res ) {
    res.sendFile( path.join(__dirname, 'public', 'mire.html') );
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

    socket.on( 'phoneReady', function() {
        console.log( "phone is ready, yo !" );
        redisPhone.publish("evolyonPhone", "someone wants a cell");
    });
} );
