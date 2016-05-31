# pixelBot

`npm install` in the main directory. `bower install` in /public

## Making it yours
- Put Particle deviceID/access token information in pixelBotParticleTEMP.js, then remove TEMP from the name so it's pixelBotParticle.js
- Put whatever the server URL ends up being in public/config.js

## The API
One thing to keep in mind is x,y coordinate 0,0 and index 0 maps to the bottom left corner due to where it's a good spot to drill through the monitor head to put the wire going into the LED array. If you like to put holes in things via blender, hit me up, but for me a drill is much easier ;) 

### The Javascript API
`node server.js` runs the server and serves the webpage. server.js has the following API functions that it sends to particle. This is what a webpage should communicate with and should return good, valid JSON as well as handle particle errors, invalid data, etc.  
- `GET getLEDArrDimensions` returns an object `{width: #, height: #}`
- `GET getLEDPixels` returns an array of objects representing each LED. The index of the array corresponds to the LED address
- `POST setPixel` takes var pixX, pixY, pixR, pixG, pixB representing what x, y coordinate to turn what RGB value. Remember that 0,0 maps to the lower left hand corner of the array.

### Exposed Particle Functions and Variables
pixelbot.ino is to be ran on the Particle. You'll need to add the fastLED library.
It has several exposed functions and variables
- `POST setPixel` takes x,y,red,blue,green and lights up that LED with that color
- `POST setAll` takes red,blue,green and lights up all LEDs with that color
- `GET ledDims` returns the height and width separated by a comma. I don't JSON this because it's two numbers.
- `GET ledInfo` returns led rgb info by index. It's worth the extra memory usage to have this return JSON that's easier to parse in the API