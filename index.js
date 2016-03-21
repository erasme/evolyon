var express = require( 'express' );
var app = express();
var server = require( 'http' ).createServer( app );
var io = require( 'socket.io' )( server );
var port = process.env.PORT || 3010;

var config = require( "./config" );



var serialport = require( "serialport" );
var SerialPort = serialport.SerialPort;

var ootsidebox = new SerialPort( config.serial, {
	baudrate: 115200,
	parser: serialport.parsers.readline( "\n" )
}, false );



app.use( express.static( __dirname + '/public' ) );

app.get( '/', function( req, res ) {
	res.sendfile( 'public/index.html' );
} );

app.get( '/single/:id', function( req, res ) {
	// res.send('cell ' + req.params.id);
	res.sendFile( 'public/single.html' );
} );

server.listen( port, function() {
	console.log( 'Server listening at port %d', port );
} );



// generate cells
var NB_CELLS = 10;

var cells = Array.apply( null, Array( NB_CELLS ) ).map( function( d, i ) {
	return {
		x: randomInt( 0, 600 ),
		y: randomInt( 0, 600 ),
		easing: randomInt( 1, 100 ) / 100,
		delay: randomInt( 50, 300 )
	}
} );



/*
 * Events for Ootsidebox
 */
var prevActive = false;
var POS_LENGTH = 20;
var gestures = new Array( POS_LENGTH );
var minX = 999, maxX = -999,
    minY = 999, maxY = -999,
    minZ = 999, maxZ = -999;
var prevGest = {
	x: 0,
	y: 0,
	z: 0,
	ts: Date.now()
};

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

function getAverage( axis ){
	var values = gestures.map( function( d ) {
		return d[ axis ];
	} );
	var sum = values.reduce( function( a, b ) {
		return a + b;
	} );
	var avg = sum / values.length;
	return avg;
}

function updateMinMax( gesture ){
	var minMaxChanged = false;

	if( gesture.x < minX ){
		minX = gesture.x;
		minMaxChanged = true;
	}
	else if( gesture.x > maxX ){
		maxX = gesture.x;
		minMaxChanged = true;
	}

	if( gesture.y < minY ){
		minY = gesture.y;
		minMaxChanged = true;
	}
	else if( gesture.y > maxY ){
		maxY = gesture.y;
		minMaxChanged = true;
	}

	if( gesture.z < minZ ){
		minZ = gesture.z;
		minMaxChanged = true;
	}
	else if( gesture.z > maxZ ){
		maxZ = gesture.z;
		minMaxChanged = true;
	}

	if( minMaxChanged ){
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


var prevTime = Date.now();
var prevEvent = null;
var minTimeDiffBetweenEvents = 50;

io.on( 'connection', function( socket ) {

  console.log("socket connected");

	// send cells infomation
	socket.emit( 'cells', cells );

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

		var active = ( gesture.z < 150 );
		updateMinMax( gesture );

		var normedGesture = {
			x: map( getAverage('x'), minX, maxX, 0, 1 ),
			y: map( getAverage('y'), minY, maxY, 0, 1 ),
			z: map( getAverage('z'), minZ, maxZ, 0, 1 )
		};

		// console.log(normedGesture);
    var currentEvent = null;
    if( active && !prevActive ){
      currentEvent = 'mouseDown';
		}
		else if( prevActive && active ){
      currentEvent = 'mouseMoved';
		}
		else if( prevActive && !active ){
      currentEvent = 'mouseUp';
		}


    // emit if event has changed
    if(currentEvent && (currentEvent != prevEvent)) {
      socket.emit( currentEvent, normedGesture );
      console.log(currentEvent);
    } else if ( currentEvent && Date.now() - prevTime > minTimeDiffBetweenEvents) {
      socket.emit( currentEvent, normedGesture );
      console.log(currentEvent);
      prevTime = Date.now();
    }

    prevEvent = currentEvent;
		prevActive = active;
		prevGest = gesture;
	} );

	// when the user disconnects.. perform this
	socket.on( 'disconnect', function() {
		console.log( "bye !" );
	} );
} );

function randomInt( min, max ) {
	return ~~( Math.random() * ( max - min + 1 ) + min );
}

function ease( value, target, easingVal ) {
	var d = target - value;
	if ( Math.abs( d ) > 1 ) value += d * easingVal;
	return value;
}

function map( n, start1, stop1, start2, stop2 ) {
    return ( ( n - start1 ) / ( stop1 - start1 ) ) * ( stop2 - start2 ) + start2;
};
