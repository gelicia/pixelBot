# pixelBot
This is being actively worked on. Not everything works yet, I wouldn't recommend going nuts on this for a week or so as I have some things that aren't working yet. I've turned off issues and am not looking for feature requests or anything until I'm done building what's necessary.

## Making it
- Print out the pieces besides the body here http://www.thingiverse.com/thing:291926
- Print out the body http://www.thingiverse.com/thing:1589599 (Thanks again to Catlinman for his blender skills!)
- TODO: How to make the LED head
- Clone/download repo. Run `npm install` in the main directory and run `bower install` in /public
- pixelbot.ino is to be ran on the Particle. You'll need to add the fastLED library.
- Put Particle deviceID/access token information in pixelBotParticleTEMP.js, then remove TEMP from the name so it's pixelBotParticle.js
- Put whatever the server URL ends up being in public/config.js
- `node server.js` to run the server.

## The API
One thing to keep in mind is x,y coordinate 0,0 and index 0 maps to the bottom left corner due to where it's a good spot to drill through the monitor head to put the wire going into the LED array. If you like to put holes in things via blender, hit me up, but for me a drill is much easier ;) 

### The Javascript API
server.js has the following API functions that it sends to particle. This is what a webpage should communicate with and should return good, valid JSON as well as handle particle errors, invalid data, etc.  
- `GET getLEDArrDimensions` returns an object `{width: #, height: #}`
- `GET getLEDPixels` returns an array of objects representing each LED. The index of the array corresponds to the LED address. The objects contain the r, g, b value for that LED.
- `POST setPixel` takes var pixX, pixY, pixR, pixG, pixB representing what x, y coordinate to turn what RGB value. Remember that 0,0 maps to the lower left hand corner of the array.

### Exposed Particle Functions and Variables
It has several exposed functions and variables
- `POST setPixel` takes x,y,red,blue,green and lights up that LED with that color
- `POST setAll` takes red,blue,green and lights up all LEDs with that color
- `GET ledDims` returns the height and width separated by a comma. I don't JSON this because it's two numbers.
- `GET ledInfo` returns led rgb info by index. It's an array of arrays with 3 values, signifying the r, g, b value of the led by index. This should return the most condensed form that JSON.parse() can understand. This will break if you have too many LEDs - maximum string length allowed out is 622 bytes.
