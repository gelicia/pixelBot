// This #include statement was automatically added by the Particle IDE.
#include "FastLED/FastLED.h"
FASTLED_USING_NAMESPACE;

#define PIXEL_TYPE WS2812B
#define DATA_PIN D3

const int LEDsH = 4; // edit with your dimensions
const int LEDsW = 6;

const int NUM_LEDs = LEDsH * LEDsW;

char ledDimensions[15];

CRGB leds[NUM_LEDs];

void setup()
{
  Serial.begin(9600);
  
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDs);
  set_max_power_in_volts_and_milliamps(5,1000); 
  
  //prepare the ledDimensions data
  char temp[4];
  itoa(LEDsH,temp,10);
  strcat(ledDimensions,temp);
  strcat(ledDimensions,",");
  itoa(LEDsW,temp,10);
  strcat(ledDimensions,temp);

    //sprintf (ledDimensions, "%d,%d", LEDsW, LEDsH);

  Particle.function("setPixel", setPixel);
  Particle.function("setAll", setAll);
  Particle.variable("ledDim", ledDimensions, STRING);
  Particle.variable("ledArr", leds);
}

void loop() {
    FastLED.show();
}

int setPixel(String command){
    int pixXIdx = command.indexOf(',');
    int pixYIdx = command.indexOf(',', pixXIdx+1);
    int pixRIdx = command.indexOf(',', pixYIdx+1);
    int pixGIdx = command.indexOf(',', pixRIdx+1);
    int pixBIdx = command.indexOf(',', pixGIdx+1);
    
    int pixX = command.substring(0, pixXIdx).toInt();
    int pixY = command.substring(pixXIdx+1, pixYIdx).toInt();
    int pixR = command.substring(pixYIdx+1, pixRIdx).toInt();
    int pixG = command.substring(pixRIdx+1, pixGIdx).toInt();
    int pixB = command.substring(pixGIdx+1, pixBIdx).toInt();
    
    Serial.println(command + " " + String(pixX) + " " + String(pixY) + " " + String(pixR) + " " + String(pixG) + " " + String(pixB));
    
    leds[getAddr(pixX, pixY)].setRGB(pixR, pixG, pixB);
    FastLED.show();
    return 1;
}

int setAll(String command){
    int pixRIdx = command.indexOf(',');
    int pixGIdx = command.indexOf(',', pixRIdx+1);
    int pixBIdx = command.indexOf(',', pixGIdx+1);
    
    int pixR = command.substring(0, pixRIdx).toInt();
    int pixG = command.substring(pixRIdx+1, pixGIdx).toInt();
    int pixB = command.substring(pixGIdx+1, pixBIdx).toInt();
    
    
    for(int i=0; i<NUM_LEDs; i++) {
        leds[i].setRGB(pixR, pixG, pixB);
    }
    FastLED.show();
}


int getAddr(uint32_t x, uint32_t y){
  return (y*LEDsW) + ( ((y&1)==0) ? x : ((LEDsW-1)-x) );
}