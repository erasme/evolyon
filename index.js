var express = require( 'express' );
var app = express();
var server = require( 'http' ).createServer( app );
var io = require( 'socket.io' )( server );
var port = process.env.PORT || 3010;

var config = require( "./config" );



// var CaressServer = require('caress-server');
// var caress = new CaressServer('0.0.0.0', 3333, {json: true});



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
var NB_CELLS = 45;

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
var prevGest = {
    x: 0,
    y: 0,
    z: 0,
    ts: Date.now()
};
var ootsideboxActive = false;
var moveEventTime = null;
var currentEvent = null;
var eventSent = false;

var POS_LENGTH = 10;
var prevPos = new Array( POS_LENGTH );

// detect average position
var AXIS_AVG_MEDIUM = {
    x: 45,
    y: 45,
    z: 150
}; // calibrate

// tell OootsideBox to send raw values instead of pre-calculated events
function sendRawInstructions() {
    ootsidebox.write( "V", function( err, results ) {
        if ( err ) console.log( 'err ' + err );
        console.log( 'results ' + results );
    } );
}

// store coordinates in an array
function addPrevPos( x, y, z ) {
    prevPos.unshift( {
        x: x,
        y: y,
        z: z
    } ); // prepend value to array
    prevPos.pop();
}

// get average difference on the array of values for one axis
function getDiff( axis ) {
    var values = prevPos.map( function( d ) {
        return d[ axis ]
    } );
    var sum = values.reduce( function( a, b ) {
        return a + b;
    } );
    var avg = sum / values.length;
    var diff = values.reduce( function( a, b ) {
        return avg * 2 - ( a + b );
    } );
    return parseInt( diff )
}

// try to connect to the ootside box
ootsidebox.open( function( error ) {
    // check if connection works
    if ( error ) {
        console.log( 'No Ootsidebox connected on: ' + error );
        io.on( 'connection', function( socket ) {
            socket.emit( 'cells', cells )
        } );
    } else {
        console.log( "OotsideBox connected" );

        // tell OootsideBox to send raw values instead of pre-calculated events
        sendRawInstructions();

        io.on( 'connection', function( socket ) {
            // io.emit( 'ootsidebox', "connected" );

            // send cells infomation
            socket.emit( 'cells', cells );

            // parse raw data
            ootsidebox.on( 'data', function( data, err ) {

                var raw = data.split( "|" );

                if ( raw.length == 1 ) sendRawInstructions(); // make sure the V is sent

                var x = parseInt( raw[ 4 ] ),
                    y = parseInt( raw[ 5 ] ),
                    z = parseInt( raw[ 6 ] ),
                    ts = Date.now();

                addPrevPos( x, y, z );

                // EVENTS
                var diffX = getDiff( "x" ),
                    diffY = getDiff( "y" ),
                    diffZ = getDiff( "y" ) * 3;

                // check if there is an important difference in any value
                // TODO : check range properly
                if ( Math.abs( diffX ) < 15 || Math.abs( diffY ) > 15 || Math.abs( diffY ) > 15 ) {
                    // get the biggest difference
                    var axis = [ "x", "y", "z" ];
                    var maxs = [ diffX, diffY, diffZ ];
                    var max = Math.max( diffX, diffY, diffZ );
                    // console.log( axis[ maxs.indexOf( max ) ], max );
                }

                // parse events
                var moveEvent = undefined;

                // hit event
                if ( diffZ > 6 && diffX < 2 && diffX > -2 && diffY < 2 && diffY > -2 ) moveEvent = "hit";

                // shake event

                // if(diffZ < 4  && diffZ > -4  &&diffY > 10) moveEvent = "up";
                // if(diffY > 10) moveEvent ="left";
                // if(diffY < -10) moveEvent ="right";

                // if there is a change, record new event
                if ( moveEvent && !currentEvent ) {
                    moveEventTime = ts;
                    currentEvent = moveEvent;
                }

                // keep the event alive for 1s
                if ( ts < ( moveEventTime + 1000 ) ) {
                    if ( !eventSent ) {
                        console.log( moveEvent );
                        socket.emit( moveEvent, "gesture" );
                        eventSent = true;
                    }
                } else {
                    currentEvent = null;
                    eventSent = false;
                }

                //
                if ( diffZ > 2 || diffY > 2 || diffX > 2 )
                    ootsideboxActive = true;
                else
                    ootsideboxActive = false;

                var gesture = {
                    x: x,
                    y: y,
                    z: z,
                    active: ootsideboxActive,
                    ts: ts
                };

                socket.emit( "gesture", gesture );
                prevGest = gesture;

            } );

            // when the user disconnects.. perform this
            socket.on( 'disconnect', function() {
                console.log( "bye !" );
            } );
        } );
    }
} );

function randomInt( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}
