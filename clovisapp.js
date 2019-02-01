//var router = require('express');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var http2 = require('http').createServer(handler2);  //require http server, and create server with function handler()
var io = require('socket.io')(http);//require socket.io module and pass the http object (server)
var fs = require('fs'); //require filesystem module
var path = require('path');
var WebSocket = require('ws');
const { spawn } = require('child_process');
var terminate = require('terminate');

app.use(express.static('./public'));

//GPIO settings
/*const Gpio = require('pigpio').Gpio;
    // Motor varibles
const leftMotor = new Gpio(16, {mode:Gpio.OUTPUT});
const rightMotor = new Gpio(12, {mode:Gpio.OUTPUT});
const leftMotorBack = new Gpio(27, {mode:Gpio.OUTPUT});
const rightMotorBack = new Gpio(22, {mode:Gpio.OUTPUT});
var pwmLeftSpeed = 150;
var pwmRightSpeed = 145;
var timeoutSpeed = 2000;
    //Camera Tilt Servos 
const cameraTiltLR = new Gpio(24, {mode:Gpio.OUTPUT});
const cameraTiltUD = new Gpio(25, {mode:Gpio.OUTPUT});
    //ultrasonic sensor variables
//const ultraDeviceServo = new Gpio(xxx, {mode:Gpio.OUTPUT});
const trigger = new Gpio(5, {mode: Gpio.OUTPUT});
const echo = new Gpio(6, {mode: Gpio.INPUT, alert: true});
trigger.digitalWrite(0); // Make sure trigger is low
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321; */

// router routes for app
app.get('/control', function (req, res) {
    res.sendFile(__dirname + '/public/clovisapp.html');
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/clovisappClient.html');
})

http.listen(3000, function(){
    console.log('listening on *:3000 - Application Running');
  });

//io socket for robot controls runs on port 3000 -http
io.sockets.on('connection', function (socket) {// (socketIO) Connection
    console.log("connect coneccted client");

      socket.on('stopRobot', function(data){
          console.log('Motor movement has been supspended.');
          resetMotors();
      });

      socket.on('robotLeft', function(data) { 
        console.log("Clovis Bot moves left for (" + timeoutSpeed + ") milliseconds."); 
        resetMotors();
        leftMotor.pwmWrite(pwmLeftSpeed);
        rightMotorBack.pwmWrite(pwmRightSpeed);
        if(data != 1){
            setTimeout(resetMotors, timeoutSpeed);
        }    
      });
    
      socket.on('robotRight', function(data) { 
        console.log("Clovis Bot moves right for (" + timeoutSpeed + ") milliseconds."); 
        resetMotors();
        rightMotor.pwmWrite(pwmRightSpeed);
        leftMotorBack.pwmWrite(pwmLeftSpeed);
        if(data != 1){
            setTimeout(resetMotors, timeoutSpeed);
        }  
      });
    
      socket.on('robotUp', function(data) { 
        console.log("Clovis Bot moves foward for (" + timeoutSpeed + ") milliseconds."); 
        resetMotors();
        leftMotor.pwmWrite(pwmLeftSpeed);
        rightMotor.pwmWrite(pwmRightSpeed);
        if(data != 1){
            setTimeout(resetMotors, timeoutSpeed);
        }  
      });

      socket.on('robotDown', function(data) { 
        console.log("Clovis Bot moves backwards for (" + timeoutSpeed + ") milliseconds."); 
        resetMotors();
        rightMotorBack.pwmWrite(pwmRightSpeed);
        leftMotorBack.pwmWrite(pwmLeftSpeed);
        if(data != 1){
            setTimeout(resetMotors, timeoutSpeed);
        }  
      });
    
      socket.on('robotSnapshot', function(data) {
        console.log("Clovis Bot is processing Snapshot."); 
        terminate(child.pid, function(err, done){
            if(err) { // you will get an error if you did not supply a valid process.pid 
              console.log("Oopsy: " + err); // handle errors in your preferred way.
            }
            else {
              console.log("**<-PREVIOUS PROCESS TERMINATed->**"); // do what you do best! 
            }
            //We have terminated child - now set a new child
            setBashScript(1);
            console.log("Snapshot Complete - Photo was stored in Clovis Gallery.");
        });
      });

      socket.on('robotRecord', function(data) { 
        console.log("Clovis Bot is processing video operations."); 
        terminate(child.pid, function(err, done){
            if(err) { // you will get an error if you did not supply a valid process.pid 
              console.log("Oopsy: " + err + "- forcing new process.pid."); // handle errors in your preferred way. 
            }
            else {
              console.log("**<- PREVIOUS PROCESS TERMINATed->**"); // do what you do best! 
            }
                    //We have terminated child - now set a new child
        setBashScript(2);
        console.log("Process Running - Live feed is being processed into Clovis Video Gallery.");
        });
      });

      socket.on('robotRefreshProcess', function(data) { 
        console.log("Clovis Bot is processing a fresh live feed."); 
        terminate(child.pid, function(err, done){
            if(err) { // you will get an error if you did not supply a valid process.pid 
              console.log("Oopsy: " + err + "- forcing new process.pid."); // handle errors in your preferred way. 
            }
            else {
              console.log("**<- PREVIOUS PROCESS TERMINATed->**"); // do what you do best! 
            }
                    //We have terminated child - now set a new child
        setBashScript(0);
        console.log("Process Complete - A fresh live video feed has been processed");
        });
    });

      socket.on('cameraTiltLeft', function(data) { 
        pulseWidthCameraServoLR = pulseWidthCameraServoLR + incrementLR;
        rotateCameraTiltLR();
      });

      socket.on('cameraTiltRight', function(data) { 
        pulseWidthCameraServoLR = pulseWidthCameraServoLR - incrementLR;
        rotateCameraTiltLR();
      });

      socket.on('cameraTiltUp', function(data) { 
        pulseWidthCameraServoUD = pulseWidthCameraServoUD - incrementUD;
        rotateCameraTiltUD();
      });

      socket.on('cameraTiltDown', function(data) { 
        pulseWidthCameraServoUD = pulseWidthCameraServoUD + incrementUD;
        rotateCameraTiltUD();
      });

      socket.on('cameraTiltRestart', function(data) { 
        pulseWidthCameraServoLR = servoMiddle;
        pulseWidthCameraServoUD = servoMiddleUD;
        rotateCameraTiltLR();
        rotateCameraTiltUD();
      });

      socket.on('changeModulationLeft', function(data){
        pwmLeftSpeed = data;
        console.log("PWM value for left motors set: " + pwmLeftSpeed);
      });

      socket.on('changeModulationRight', function(data){
        pwmRightSpeed = data;
        console.log("PWM value for right motors set: " + pwmRightSpeed);
      });

      socket.on('changeTimeout', function(data){
	    timeoutSpeed = data;
	    console.log("Clovis timeout speed set: " + timeoutSpeed);
      });

});//end of socketio for robot controls

//motor functions - most of functionality for motors is in socketIO.on callback functions above
function resetMotors(){
    leftMotor.digitalWrite(0);
    rightMotor.digitalWrite(0);
    leftMotorBack.digitalWrite(0);
    rightMotorBack.digitalWrite(0);
}

var servoMiddle = 1500; // middle value for servo
var servoMax = 2500; // max value for servo
var servoMin = 500; // min value for servo 

var servoMiddleUD = 1500;
var servoMaxUD = 2100;
var servoMinUD = 800

let pulseWidthCameraServoLR = servoMiddle;
let incrementLR = 100;
function rotateCameraTiltLR(){
    if(pulseWidthCameraServoLR > servoMax){
        pulseWidthCameraServoLR = servoMax;
    }else
    if(pulseWidthCameraServoLR < servoMin){
        pulseWidthCameraServoLR = servoMin;
    }
    cameraTiltLR.servoWrite(pulseWidthCameraServoLR);
    console.log("the server posoition is: " + pulseWidthCameraServoLR);
}

let pulseWidthCameraServoUD = servoMiddle;
let incrementUD = 100;
function rotateCameraTiltUD(){
    if(pulseWidthCameraServoUD > servoMaxUD){
        pulseWidthCameraServoUD = servoMaxUD;
    }else
    if(pulseWidthCameraServoUD < servoMinUD){
        pulseWidthCameraServoUD = servoMinUD;
    }
    cameraTiltUD.servoWrite(pulseWidthCameraServoUD);
    console.log("the server posoition is: " + pulseWidthCameraServoUD);

}

var distance = 20;
var angle = 90; // angle must be from 90 - 270 in order to format client radar correctly
//Ultrasound Functions - this functions should update distance variable
const watchHCSR0 = () => {
    let startTick;
   
    echo.on('alert', (level, tick) => {
       if (level == 1) {
              startTick = tick;
       } else {
          const endTick = tick;
          const diff = (endTick) - (startTick ); // Unsigned 32 bit arithmetic
          //distance = (diff / 2 / MICROSECDONDS_PER_CM);
          console.log(diff / 2 / MICROSECDONDS_PER_CM);
                        }
          });
console.log("trigger complete");
};

//watchHCSR0(); // Calls the Ultrasonic watchFunction for init setup

// Trigger a distance measurement once per second
setInterval(() => {
 //trigger.trigger(10, 1); // Set trigger high for 10 microseconds
 io.emit('radarMessage', angle, distance);
 //angle++;
 //cameraTiltUD.servoWrite(2000);
 }, 1000);

//////////////// Handels ported stream from ffMPEG to http2 server(3001)
var RECORD_STREAM = false;
http2.listen(3001); //listen to port 3001 for stream
function handler2(request, response){
    var params = request.url.substr(1).split('/');

	/*if (params[0] !== STREAM_SECRET) {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + ':' +
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	} */

	response.connection.setTimeout(0);
	console.log(
		'Stream Connected: ' + 
		request.socket.remoteAddress + ':' +
		request.socket.remotePort
	);
	request.on('data', function(data){
		socketServer.broadcast(data);
		if (request.socket.recording) {
			request.socket.recording.write(data);
		}
	});
	request.on('end',function(){
		console.log('close');
		if (request.socket.recording) {
			request.socket.recording.close();
		}
	});

	// Record the stream to a local file?
	if (RECORD_STREAM) {
		var path = 'recordings/' + Date.now() + '.ts';
		request.socket.recording = fs.createWriteStream(path);
	}
}

var WEBSOCKET_PORT = process.argv[4] || 8082;  //websocket for stream run on this port
/////websocket protcol for stream
var socketServer = new WebSocket.Server({port: WEBSOCKET_PORT, perMessageDeflate: false});
  socketServer.connectionCount = 0;
  socketServer.on('connection', function(socket, upgradeReq) {
      socketServer.connectionCount++;
      console.log(
          'New WebSocket Connection: ', 
          (upgradeReq || socket.upgradeReq).socket.remoteAddress,
          (upgradeReq || socket.upgradeReq).headers['user-agent'],
          '('+socketServer.connectionCount+' total)'
      );
      socket.on('close', function(code, message){
          socketServer.connectionCount--;
          console.log(
              'Disconnected WebSocket ('+socketServer.connectionCount+' total)'
          );
      });
  });
  socketServer.broadcast = function(data) {
      socketServer.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
              client.send(data);
          }
      });
  };
  
  //const child = spawn('./feedmpeg.sh');
  //const child = spawn('./feedSnapshot.sh');
  //const child = spawn('./feedmpegRecord.sh');
var child = spawn('./feedmpeg.sh'); /// load defualt child spawn

function setBashScript(scriptNum){
    if(scriptNum == 0){
        //do this
         child = spawn('./feedmpeg.sh');
    }
    if(scriptNum == 1){
        //do this
        updatePicturePath();
         child = spawn('./feedSnapshot.sh',[pictureFilePath]);
    }
    if(scriptNum == 2){
        //do this
        updateVideoPath();
         child = spawn('./feedmpegRecord.sh',[videoFilePath]);
    }
}

var videoFilePath = "public/recordings/streamedVideo#.avi";
var pictureFilePath = "public/snapshots/capturedPicture#.jpg";

function updateVideoPath(){
    var addedPathNumber = 0;
    while (fs.existsSync("public/recordings/streamedVideo#" + addedPathNumber +".avi")) {
        // Do something
        addedPathNumber++;
    }
    videoFilePath = "public/recordings/streamedVideo#" + addedPathNumber +".avi";
}

function updatePicturePath(){
    var addedPathNumber = 0;
    while (fs.existsSync("public/snapshots/capturedPicture#" + addedPathNumber +".jpg")) {
        // Do something
        addedPathNumber++;
    }
    pictureFilePath = "public/snapshots/capturedPicture#" + addedPathNumber +".jpg";
}

