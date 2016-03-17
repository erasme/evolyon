// var osc = require('node-osc');
//
// var oscServer = new osc.Server(3333, '0.0.0.0');
//
// oscServer.on("message", function (msg, rinfo) {
//   console.log("TUIO message:"); console.log(msg);
// });
//
// var CaressServer = require('caress-server');
// var caress = new CaressServer('0.0.0.0', 3333, {json: true});
//
// caress.on('tuio', function(msg){
//   console.log(msg);
//
// });

var SerialPort = require("serialport").SerialPort;
var serialport = new SerialPort("/dev//dev/ttyACM0");

serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', function(data){
      console.log(data[0]);
  });
});
