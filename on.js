var wpi = require('wiring-pi');


wpi.setup('wpi');
wpi.pinMode(7,wpi.OUTPUT)

for(var x=0;x<=8;x++)
wpi.digitalWrite(x,1);
