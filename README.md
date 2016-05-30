# pixelBot

Put Particle deviceID/access token information in pixelBotParticleTEMP.js, then remove TEMP from the name so it's pixelBotParticle.js

node server.js runs the server and serves the webpage.
server.js has the following API functions that it sends to particle
- `GET getLEDArrDimensions` returns an object `{width: #, height: #}`
- `GET getLEDPixels`
- `POST setPixel`

Put whatever the server URL ends up being in config.js

pixelbot.ino is to be ran on the Particle. You'll need to add the fastLED library.
It has several exposed functions and variables
- `POST setPixel` takes x,y,red,blue,green and lights up that LED with that color
- `POST setAll` takes red,blue,green and lights up all LEDs with that color
- `POST ledDims` returns the height and width separated by a comma.