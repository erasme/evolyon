// var body = document.querySelector( 'body' );
document.body.style.height = window.innerHeight + 'px';

// size of the abribus
var abribus = {
    "height": 120,
    "width": 176
};

var h = window.innerHeight - 50;
var w = ( 120 / 176 ) * h;

var x = 0,
    minX = 999,
    maxX = -999,
    diffX = 0,
    y = 0,
    minY = 999,
    maxY = -999,
    diffY = 0,
    z = 0,
    minZ = 999,
    maxZ = -999,
    diffZ = 0,
    prevGesture = {active:false};

var cells = [];

// mouse events for web version
d3.select( "canvas" )
    .on( "mousemove", function( d ) {
        // convert x and y on a range from 0 to 100
        x = ( d3.mouse( this )[ 0 ] / w ) * 100;
        y = ( d3.mouse( this )[ 1 ] / h ) * 100;
        // console.log( x, y );
    } );

var socket = io();
socket.emit( 'join', ~~ ( Math.random() * 10 ) );

socket.on( 'cells', function( data ) {
    cells = data;
} );

socket.on( 'gesture', function( data ) {
    // console.log(data);
    diffX = data.x - x;
    x = data.x;
    minX = Math.min( minX, data.x );
    maxX = Math.max( maxX, data.x );

    diffY = data.y - y;
    y = data.y;
    minY = Math.min( minY, data.x );
    maxY = Math.max( maxY, data.x );

    diffZ = data.z - z;
    z = data.z;
    minZ = Math.min( minZ, data.x );
    maxZ = Math.max( maxZ, data.x );

    if ( data.active && !prevGesture.active ) {
    	mouseDownEvent( 
    		~~map( x, minX, maxX, 0, canvas.width ),
    		~~map( y, minY, maxY, canvas.height, 0 )
		);
    }
    else if( data.active ){
    	mouseMoveEvent( 
    		~~map( x, minX, maxX, 0, canvas.width ),
    		~~map( y, minY, maxY, canvas.height, 0 )
		);
    }
    else if( prevGesture.active && !data.active ){
    	mouseUpEvent( 
    		~~map( x, minX, maxX, 0, canvas.width ),
    		~~map( y, minY, maxY, canvas.height, 0 )
		);
    }
    prevGesture = data;
} );

socket.on( 'hit', function( data ) {
    console.log( "hit" );
} );

socket.on( 'swipe', function( data ) {
    console.log( "swipe" );
} );

socket.on( 'shake', function( data ) {
    console.log( "shake" );
} );

var map = function( n, start1, stop1, start2, stop2 ) {
    return ( ( n - start1 ) / ( stop1 - start1 ) ) * ( stop2 - start2 ) + start2;
};
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
    x -= _rc.x;
    y -= _rc.y;// - getScrollY();
    if ( _points.length > 0 )
        _g.clearRect( 0, 0, _rc.width, _rc.height );
    _points.length = 1; // clear
    _points[ 0 ] = new Point( x, y );
    drawText( "Recording unistroke..." );
    _g.fillRect( x - 4, y - 3, 9, 9 );
}

function mouseMoveEvent( x, y ) {
    if ( _isDown ) {
        x -= _rc.x;
        y -= _rc.y - getScrollY();
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
            var result = _r.Recognize( _points, true );
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

/* // Unistroke Adding and Clearing
	function onClickAddExisting() {
	    if ( _points.length >= 10 ) {
	        var unistrokes = document.getElementById( 'unistrokes' );
	        var name = unistrokes[ unistrokes.selectedIndex ].value;
	        var num = _r.AddGesture( name, _points );
	        drawText( "\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + "." );
	    }
	}

	function onClickAddCustom() {
	    var name = document.getElementById( 'custom' ).value;
	    if ( _points.length >= 10 && name.length > 0 ) {
	        var num = _r.AddGesture( name, _points );
	        drawText( "\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + "." );
	    }
	}

	function onClickCustom() {
	    document.getElementById( 'custom' ).select();
	}

	function onClickDelete() {
	    var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
	    alert( "All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types." );
	}
*/
