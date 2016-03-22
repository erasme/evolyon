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
var path = require('path');
var config = require( "../config" );

var redisHost = config.redisHost || "127.0.0.1";
var redisPort = config.redisPort || "6379";

var redis = require("redis");
var redisClient = redis.createClient(redisPort, redisHost);

redisClient.on('connect', function() {
    console.log('Redis client connected on '+ redisHost+":"+ redisPort);
});

// subscribe to redis
redisClient.subscribe("evolyon");
redisClient.on("message", function(channel, message){
  //pop off new item
  console.log("redis-message");
  console.log(message);

  io.emit("phoneReady", function(data){
    console.log(data);
  })
  
});

/*
        ____              __  _
       / __ \____  __  __/ /_(_)___  ____ _
      / /_/ / __ \/ / / / __/ / __ \/ __ `/
     / _, _/ /_/ / /_/ / /_/ / / / / /_/ /
    /_/ |_|\____/\__,_/\__/_/_/ /_/\__, /
                                  /____/
*/
app.use( express.static( path.join(__dirname, '../public') ) );

app.get( '/', function( req, res ) {
    res.sendFile(path.join(__dirname, '../public', 'cells.html') );
} );

server.listen( port, function() {
    console.log( 'Server listening at port %d', port );
} );


/*
       ______     ____
      / ____/__  / / /____
     / /   / _ \/ / / ___/
    / /___/  __/ / (__  )
    \____/\___/_/_/____/
*/
var NB_CELLS = 10;
var cells = Array.apply( null, Array( NB_CELLS ) ).map( function( d, i ) {
    return {
        x: randomInt( 0, 600 ),
        y: randomInt( 0, 600 ),
        easing: Math.random() / 50,
        delay: randomInt( 50, 300 )
    }
} );


/*
       _____            __        __    _
      / ___/____  _____/ /_____  / /_  (_)___
      \__ \/ __ \/ ___/ //_/ _ \/ __/ / / __ \
     ___/ / /_/ / /__/ ,< /  __/ /__ / / /_/ /
    /____/\____/\___/_/|_|\___/\__(_)_/\____/
*/
io.on( 'connection', function( socket ) {
    console.log( "socket connected" );

    // send cells infomation
    io.emit( 'cells', cells );

    // when the user disconnects.. perform this
    socket.on( 'disconnect', function() {
        console.log( "bye !" );
    } );
} );


/*
       ____        __       _     __     ____
      / __ \____  / /______(_)___/ /__  / __ )____  _  __
     / / / / __ \/ __/ ___/ / __  / _ \/ __  / __ \| |/_/
    / /_/ / /_/ / /_(__  ) / /_/ /  __/ /_/ / /_/ />  <
    \____/\____/\__/____/_/\__,_/\___/_____/\____/_/|_|
       _____ ____     ____            __
      |__  // __ \   / __ \____ _____/ /
       /_ </ / / /  / /_/ / __ `/ __  /
     ___/ / /_/ /  / ____/ /_/ / /_/ /
    /____/_____/  /_/    \__,_/\__,_/

*/
var serialport = require( "serialport" );
var SerialPort = serialport.SerialPort;
var ootsidebox = new SerialPort( config.serial, {
    baudrate: 115200,
    parser: serialport.parsers.readline( "\n" )
}, false );

var POS_LENGTH = 20,
    gestures = new Array( POS_LENGTH ),
    minX = 999, maxX = -999,
    minY = 999, maxY = -999,
    minZ = 999, maxZ = -999,
    prevPresence = false,
    minTimeBeforeNoPresence = 10000,
    timePresStarted = 0,
    prevActive = false,
    prevGest = {
        x: 0,
        y: 0,
        z: 0,
        ts: Date.now()
    },
    prevTime = Date.now(),
    prevEvent = null,
    minTimeDiffBetweenEvents = 20;


// tell OootsideBox to send raw values instead of pre-calculated events
function sendRawInstructions() {
    ootsidebox.write( "V", function( err, results ) {
        if ( err ) console.log( 'err ' + err );
        console.log( 'results ' + results );
    } );
}

// store coordinates in an array
function addGesture( gesture ) {
    gestures.pop();
    gestures.unshift( gesture ); // prepend value to array
}

function getAverage( axis ) {
    var values = gestures.map( function( d ) {
        return d[ axis ];
    } );
    var sum = values.reduce( function( a, b ) {
        return a + b;
    } );
    var avg = sum / values.length;
    return avg;
}

function updateMinMax( gesture ) {
    var minMaxChanged = false;

    if ( gesture.x < minX ) {
        minX = gesture.x;
        minMaxChanged = true;
    } else if ( gesture.x > maxX ) {
        maxX = gesture.x;
        minMaxChanged = true;
    }

    if ( gesture.y < minY ) {
        minY = gesture.y;
        minMaxChanged = true;
    } else if ( gesture.y > maxY ) {
        maxY = gesture.y;
        minMaxChanged = true;
    }

    if ( gesture.z < minZ ) {
        minZ = gesture.z;
        minMaxChanged = true;
    } else if ( gesture.z > maxZ ) {
        maxZ = gesture.z;
        minMaxChanged = true;
    }

    if ( minMaxChanged ) {
        // console.log( 'minX: ' + minX, 'maxX: ' + maxX, 'minY: ' + minY, 'maxY: ' + maxY, 'minZ: ' + minZ, 'maxZ: ' + maxZ );
    }
}

// try to connect to the ootside box
ootsidebox.open( function( error ) {
    // check if connection works
    if ( error ) {
        console.log( 'No Ootsidebox connected on: ' + error );
        io.on( 'connection', function( socket ) {
            socket.emit( 'cells', cells );
        } );
    } else {
        console.log( "OotsideBox connected" );

        // tell OootsideBox to send raw values instead of pre-calculated events
        sendRawInstructions();
    }
} );

// parse raw data
ootsidebox.on( 'data', function( data, err ) {
    var raw = data.split( "|" );
    if ( raw.length == 1 ) sendRawInstructions(); // make sure the V is sent

    var gesture = {
        x: parseInt( raw[ 4 ] ),
        y: parseInt( raw[ 5 ] ),
        z: parseInt( raw[ 6 ] ),
        ts: Date.now()
    };
    addGesture( gesture );
    updateMinMax( gesture );

    var presence = ( gesture.z < 200 );
    // console.log( presence );
    if( !prevPresence && presence){
    	timePresStarted = Date.now();
        io.emit('presence', { 'presence': true });
        console.log('presence', { 'presence': true });
    }
    else if( prevPresence && !presence && Date.now() - timePresStarted >  minTimeBeforeNoPresence ){
        io.emit('presence', { 'presence': false });
        console.log('presence', { 'presence': false });
    }
    prevPresence = presence;

    var active = ( gesture.z < 50 );
    // console.log( active );

    var normedGesture = {
        x: map( gesture.x, minX, maxX, 1, 0 ),
        y: map( gesture.y, minY, maxY, 1, 0 ),
        z: map( gesture.z, minZ, maxZ, 0, 1 )
    };

    // console.log(normedGesture);
    var currentEvent = null;
    if ( active && !prevActive ) {
        currentEvent = 'mouseDown';
    } else if ( prevActive && active ) {
        currentEvent = 'mouseMoved';
    } else if ( prevActive && !active ) {
        currentEvent = 'mouseUp';
    }

    // emit if event has changed
    if ( currentEvent && ( currentEvent != prevEvent ) ) {
        io.emit( currentEvent, normedGesture );
        console.log( currentEvent );
    } else if ( currentEvent && Date.now() - prevTime > minTimeDiffBetweenEvents ) {
        io.emit( currentEvent, normedGesture );
        console.log( currentEvent );
        prevTime = Date.now();
    }

    prevEvent = currentEvent;
    prevActive = active;
    prevGest = gesture;
} );


/*
        __  ___      __  __       ____                 __  _
       /  |/  /___ _/ /_/ /_     / __/_  ______  _____/ /_(_)___  ____  _____
      / /|_/ / __ `/ __/ __ \   / /_/ / / / __ \/ ___/ __/ / __ \/ __ \/ ___/
     / /  / / /_/ / /_/ / / /  / __/ /_/ / / / / /__/ /_/ / /_/ / / / (__  )
    /_/  /_/\__,_/\__/_/ /_/  /_/  \__,_/_/ /_/\___/\__/_/\____/_/ /_/____/

*/
function randomInt( min, max ) {
    return~~ ( Math.random() * ( max - min + 1 ) + min );
}

function ease( value, target, easingVal ) {
    var d = target - value;
    if ( Math.abs( d ) > 1 ) value += d * easingVal;
    return value;
}

function map( n, start1, stop1, start2, stop2 ) {
    return ( ( n - start1 ) / ( stop1 - start1 ) ) * ( stop2 - start2 ) + start2;
};
