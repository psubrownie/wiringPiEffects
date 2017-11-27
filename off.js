var wpi = require('wiring-pi');


wpi.setup('wpi');
wpi.pinMode(8,wpi.OUTPUT);

for(var x=0;x<=8;x++)
wpi.digitalWrite(x,0);
