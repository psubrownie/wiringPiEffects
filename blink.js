var wpi = require('wiring-pi');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

wpi.setup('wpi');
var speed = 150;//45;

for(var x=0;x<8;x++)
wpi.pinMode(x,wpi.OUTPUT);
wpi.digitalWrite(x,1);

myEmitter.on('AChase Complete', () => {
  runBChase();
});

myEmitter.on('BChase Complete', () => {
               on();
               setTimeout(function(){off();dualUP();},10000);
});
myEmitter.on('dualUp Complete',() => {
  dualDown();
});
myEmitter.on('dualDown Complete',() => {
   on();
   setTimeout(function(){off();runAChase();},10000);
});
runAChase();
//dualUP()
//oddEven();

function on(cb){
  for(var x=0;x<8;x++){
        wpi.digitalWrite(x,1);
  }
myEmitter.emit('On');
}

function off(){
  for(var x=0;x<8;x++){
    wpi.digitalWrite(x,0);
  }
}
function runAChase(cb){
  var aSpeed = speed;
  var pin = -1;
  var oldpin;
  var pid = setInterval(chase, aSpeed);

  function chase() {
    oldpin=pin++;
    wpi.digitalWrite(pin, 1);
    wpi.digitalWrite(oldpin,0);;
    if(pin>7){
          pin=-1;
       clearInterval(pid);
       myEmitter.emit('AChase Complete');
    }
  }
}
function runBChase(){
  var pin = 8;
  var bSpeed = speed;
  var oldpin;
  var pid = setInterval(chase, bSpeed);

  function chase() {
    oldpin=pin--;
    wpi.digitalWrite(pin, 1);
    wpi.digitalWrite(oldpin,0);;
    if(pin<0){
           pin=8;
       clearInterval(pid);
       myEmitter.emit('BChase Complete');
    }
  }
}

function dualUP(){
  var pinx =0;
  var piny =7;
  setIntervalX(function(){
                 wpi.digitalWrite(pinx++,1);
                 wpi.digitalWrite(pinx-2,0);
                 wpi.digitalWrite(piny--,1);
                 wpi.digitalWrite(piny+2,0);
               },speed,4,'dualUp Complete');
}
function dualDown(){
  var pinx =4-1;
  var piny =5-1;
  var oldx,oldy;
  setIntervalX(function(){
                 oldx=pinx++;
                 oldy=piny--;
                 wpi.digitalWrite(pinx,1);
                 wpi.digitalWrite(oldx,0);
                 wpi.digitalWrite(piny,1);
                 wpi.digitalWrite(oldy,0);
               },speed,5,'dualDown Complete');
}

function oddEven(){
  console.log('oddEven');
  var value = true;
  setIntervalX(function(){console.log('oddEven Loop');
                 for(var x=0;x<8;x++){
                   if((x+2)%2==0){//stupid 0 index
                     wpi.digitalWrite(x,value?1:0);
                     console.log('---'+x+':'+value?'1':'0');
                   }
                   else{
                     wpi.digitalWrite(x,!value?1:0)
                        console.log('---'+x+':'+!value?'1':'0')
                       }
                 }
                 value = !value;
               },200,4,'oddEven Complete');
}

function setIntervalX(callback, delay, repetitions,emits) {
    var x = 0;
    var intervalID = setInterval(function () {

       callback();
       ;
       if (++x === repetitions) {
           clearInterval(intervalID);
           if(emits)myEmitter.emit(emits);
       }
    }, delay);
}
