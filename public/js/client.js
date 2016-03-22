document.body.style.height = window.innerHeight + 'px';

// size of the abribus
var abribus = {
    "height": 120,
    "width": 176
};

var h = window.innerHeight - 50;
var w = ( 120 / 176 ) * h;
var gesture = {
    x: 0,
    y: 0,
    z: 0
};
var cells = [];

var socket = io();

socket.on( 'connect', function( data ) {
    console.log( "connected to socket" );
} );

socket.on( 'ha', function( data ) {
    console.log( "haha" );
} );

socket.on( 'presence', function( data ) {
    console.log( 'presence:', data.presence );
} );

socket.on( 'cells', function( data ) {
    console.log( "new cells" );
    cells = data;
} );


function updateGesture( data ) {
    gesture = data;
    gesture.x = ~~ ( data.x * 400 );
    gesture.y = 400 - ( ~~( data.y * 400 ) );
}

socket.on( 'mouseDown', function( data ) {
    updateGesture( data );
    console.log( 'mouseDown', gesture );
    mouseDownEvent( gesture.x, gesture.y );
} );

socket.on( 'mouseMoved', function( data ) {
    updateGesture( data );
    console.log( 'mouseMoved' );
    mouseMovedEvent( gesture.x, gesture.y );
} );

socket.on( 'mouseUp', function( data ) {
    updateGesture( data );
    console.log( 'mouseUp', gesture );
    mouseUpEvent( gesture.x, gesture.y );
} );

/////////////////////////////////////////////
var _isDown, _points, _r, _g, _rc;
var canvas;

function onLoadEvent() {
    _points = new Array();
    _r = new DollarRecognizer();

    canvas = document.getElementById( 'myCanvas' );
    _g = canvas.getContext( '2d' );
    _g.fillStyle = "rgb(0,0,225)";
    _g.strokeStyle = "rgb(0,0,225)";
    _g.lineWidth = 3;
    _g.font = "16px Gentilis";
    _rc = getCanvasRect( canvas ); // canvas rect on page
    _g.fillStyle = "rgb(255,255,136)";
    _g.fillRect( 0, 0, _rc.width, 20 );

    _isDown = false;
}
window.onload = onLoadEvent;

function getCanvasRect( canvas ) {
    var w = canvas.width;
    var h = canvas.height;

    var cx = canvas.offsetLeft;
    var cy = canvas.offsetTop;
    while ( canvas.offsetParent != null ) {
        canvas = canvas.offsetParent;
        cx += canvas.offsetLeft;
        cy += canvas.offsetTop;
    }
    return {
        x: cx,
        y: cy,
        width: w,
        height: h
    };
}

function getScrollY() {
    var scrollY = 0;
    if ( typeof( document.body.parentElement ) != 'undefined' ) {
        scrollY = document.body.parentElement.scrollTop; // IE
    } else if ( typeof( window.pageYOffset ) != 'undefined' ) {
        scrollY = window.pageYOffset; // FF
    }
    return scrollY;
}

// Mouse Events
function mouseDownEvent( x, y ) {
    document.onselectstart = function() {
        return false;
    } // disable drag-select
    document.onmousedown = function() {
        return false;
    } // disable drag-select
    _isDown = true;
    // x -= _rc.x;
    // y -= _rc.y;// - getScrollY();
    if ( _points.length > 0 )
        _g.clearRect( 0, 0, _rc.width, _rc.height );
    _points.length = 1; // clear
    _points[ 0 ] = new Point( x, y );
    drawText( "Recording unistroke..." );
    _g.fillRect( x - 4, y - 3, 9, 9 );
}

function mouseMovedEvent( x, y ) {
    if ( _isDown ) {
        // x -= _rc.x;
        // y -= _rc.y;// - getScrollY();
        _points[ _points.length ] = new Point( x, y ); // append
        drawConnectedPoint( _points.length - 2, _points.length - 1 );
    }
}

function mouseUpEvent( x, y ) {
    document.onselectstart = function() {
        return true;
    } // enable drag-select
    document.onmousedown = function() {
        return true;
    } // enable drag-select
    if ( _isDown ) {
        _isDown = false;
        if ( _points.length >= 10 ) {
            // var result = _r.Recognize( _points, document.getElementById( 'useProtractor' ).checked );
            var result = _r.Recognize( _points, false );
            drawText( "Result: " + result.Name + " (" + round( result.Score, 2 ) + ")." );
        } else // fewer than 10 points were inputted
        {
            drawText( "Too few points made. Please try again." );
        }
    }
}

function drawText( str ) {
    _g.fillStyle = "rgb(255,255,136)";
    _g.fillRect( 0, 0, _rc.width, 20 );
    _g.fillStyle = "rgb(0,0,255)";
    _g.fillText( str, 1, 14 );
}

function drawConnectedPoint( from, to ) {
    _g.beginPath();
    _g.moveTo( _points[ from ].X, _points[ from ].Y );
    _g.lineTo( _points[ to ].X, _points[ to ].Y );
    _g.closePath();
    _g.stroke();
}

// round 'n' to 'd' decimals
function round( n, d ) {
    d = Math.pow( 10, d );
    return Math.round( n * d ) / d
}
