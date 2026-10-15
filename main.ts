// Dropdown menu for Pins 0 through 16
enum BoardPin {
    //% block="P0"
    P0 = DigitalPin.P0,
    //% block="P1"
    P1 = DigitalPin.P1,
    //% block="P2"
    P2 = DigitalPin.P2,
    //% block="P3"
    P3 = DigitalPin.P3,
    //% block="P4"
    P4 = DigitalPin.P4,
    //% block="P5"
    P5 = DigitalPin.P5,
    //% block="P6"
    P6 = DigitalPin.P6,
    //% block="P7"
    P7 = DigitalPin.P7,
    //% block="P8"
    P8 = DigitalPin.P8,
    //% block="P9"
    P9 = DigitalPin.P9,
    //% block="P10"
    P10 = DigitalPin.P10,
    //% block="P11"
    P11 = DigitalPin.P11,
    //% block="P12"
    P12 = DigitalPin.P12,
    //% block="P13"
    P13 = DigitalPin.P13,
    //% block="P14"
    P14 = DigitalPin.P14,
    //% block="P15"
    P15 = DigitalPin.P15,
    //% block="P16"
    P16 = DigitalPin.P16
}

// Dropdown menu for ON / OFF state
enum PinState {
    //% block="HIGH (1)"
    High = 1,
    //% block="LOW (0)"
    Low = 0
}

// Preset options for continuous rotation speeds
enum ServoSpeed {
    //% block="Slow Clockwise"
    SlowCW = 1600,
    //% block="Stop"
    Stop = 1520,
    //% block="Slow Counterclockwise"
    SlowCCW = 1480
}

//% color="#8E24AA" icon="\uf013" block="Device Configure"
namespace DeviceConfig {
    /**
     * Configure any pin from P0 to P16 to HIGH or LOW
     */
    //% block="configure board pin %pin to state %state"
    //% weight=95
    export function setBoardPin(pin: BoardPin, state: PinState): void {
        pins.digitalWritePin(pin as number, state);
    }
}

//% color="#FF5722" icon="\uf0eb" block="My Signal"
//% color="#FF5722" icon="\uf0eb" block="My Signal"
namespace mySignal {
    /**
     * Blinks an LED connected to Pin P9 at default speed for a given duration in seconds
     * @param duration total seconds to blink the LED, eg: 5
     */
    //% block="blink signal on P9 for %duration seconds"
    //% duration.defl=5
    //% weight=100
    export function blinkP9ForSeconds(duration: number): void {
        // Keep 500ms ON / 500ms OFF speed constant (1 full cycle = 1 second)
        for (let i = 0; i < duration; i++) {
            pins.digitalWritePin(DigitalPin.P9, 1);
            basic.pause(500);
            pins.digitalWritePin(DigitalPin.P9, 0);
            basic.pause(500);
        }
    }

    /**
     * Blinks any chosen board pin at default speed for a given duration in seconds
     * @param pin board pin to toggle
     * @param duration total seconds to blink the pin, eg: 5
     */
    //% block="blink pin %pin for %duration seconds"
    //% duration.defl=5
    //% weight=90
    export function blinkBoardPinForSeconds(pin: BoardPin, duration: number): void {
        for (let i = 0; i < duration; i++) {
            pins.digitalWritePin(pin as number, 1);
            basic.pause(500);
            pins.digitalWritePin(pin as number, 0);
            basic.pause(500);
        }
    }
}


//% color="#4CAF50" icon="\uf06c" block="Soil Sensor"
namespace soilSensor {
    let continuousSoilValueP4 = 0;

    /**
     * Reads digital soil moisture level on Pin P4 (1 = Dry, 0 = Wet). 
     * Automatically disables the LED display matrix so Pin P4 works as a clean input pin.
     */
    //% block="read soil sensor on P4"
    //% weight=90
    export function readSoilP4(): number {
        led.enable(false);
        return pins.digitalReadPin(DigitalPin.P4);
    }

    /**
     * Enable or disable the built-in 5x5 LED display screen
     */
    //% block="set LED matrix display %on"
    //% on.shadow="toggleOnOff"
    //% weight=80
    export function setDisplay(on: boolean): void {
        led.enable(on);
    }

    /**
     * Continuously monitors soil moisture on P4 in the background
     */
    //% block="start background soil monitoring on P4"
    //% weight=85
    export function startContinuousSoilP4(): void {
        led.enable(false);
        control.inBackground(function () {
            while (true) {
                continuousSoilValueP4 = pins.digitalReadPin(DigitalPin.P4);
                basic.pause(100);
            }
        });
    }

    /**
     * Returns the latest background-read soil moisture value from P4
     */
    //% block="get continuous soil value P4"
    //% weight=84
    export function getContinuousSoilP4(): number {
        return continuousSoilValueP4;
    }
}

//% color="#009688" icon="\uf085" block="My Servos"
namespace myServos {
    /**
     * Sets the angle of a servo motor connected to Pin P7 (0 to 180 degrees)
     */
    //% block="set servo on P7 to %angle degrees"
    //% angle.min=0 angle.max=180
    //% angle.defl=90
    //% weight=95
    export function setServoP7(angle: number): void {
        pins.servoWritePin(AnalogPin.P7, angle);
    }

    /**
     * Sets continuous servo speed on P7 as a percentage (-100% to 100%)
     * @param speed speed percentage from -100 (Full CCW) to 100 (Full CW), eg: 50
     */
    //% block="set continuous servo P7 speed to %speed %%"
    //% speed.min=-100 speed.max=100 speed.defl=0
    //% weight=88
    export function setServoSpeedPercentP7(speed: number): void {
        // Clamp speed between -100 and 100
        speed = Math.max(-100, Math.min(100, speed));
        // Map -100..100 to pulse range 1000us..2000us (center 1500us)
        let pulse = 1500 + (speed * 5);
        pins.servoSetPulse(AnalogPin.P7, pulse);
    }

    /**
     * Maps an input variable (e.g. sensor reading) to a servo angle on P7
     * @param value the variable reading
     * @param inMin minimum expected input value, eg: 0
     * @param inMax maximum expected input value, eg: 1023
     */
    //% block="map variable %value| from (%inMin to %inMax) to servo P7 angle"
    //% weight=87
    export function mapVariableToServoP7(value: number, inMin: number, inMax: number): void {
        let angle = Math.map(value, inMin, inMax, 0, 180);
        angle = Math.max(0, Math.min(180, angle)); // Clamp within 0-180
        pins.servoWritePin(AnalogPin.P7, angle);
    }

    /**
     * Sets the angle of a servo motor on any chosen pin (0 to 180 degrees)
     */
    //% block="set servo on pin %pin to %angle degrees"
    //% angle.min=0 angle.max=180
    //% angle.defl=90
    //% weight=90
    export function setServoPin(pin: BoardPin, angle: number): void {
        pins.servoWritePin(pin as number, angle);
    }

    /**
     * Stops driving the servo on Pin P7 (turns off PWM signal to save power)
     */
    //% block="stop servo on P7"
    //% weight=85
    export function stopServoP7(): void {
        pins.servoSetPulse(AnalogPin.P7, 0);
    }

    /**
     * Stops driving the servo on any chosen pin (turns off PWM signal to save power)
     */
    //% block="stop servo on pin %pin"
    //% weight=80
    export function stopServoPin(pin: BoardPin): void {
        pins.servoSetPulse(pin as number, 0);
    }

    /**
     * Controls continuous rotation servo speed/direction on Pin P7 using pulse width (us)
     */
    //% block="set continuous servo on P7 pulse %pulse µs"
    //% pulse.defl=1520
    //% weight=95
    export function setServoPulseP7(pulse: number): void {
        pins.servoSetPulse(AnalogPin.P7, pulse);
    }

    /**
     * Controls continuous rotation servo speed/direction on any pin using pulse width (us)
     */
    //% block="set continuous servo on pin %pin pulse %pulse µs"
    //% pulse.defl=1520
    //% weight=90
    export function setServoPulsePin(pin: BoardPin, pulse: number): void {
        pins.servoSetPulse(pin as number, pulse);
    }

    /**
     * Sets continuous servo speed preset on Pin P7 (Slow CW, Stop, Slow CCW)
     */
    //% block="set continuous servo P7 state to %speed"
    //% weight=85
    export function setServoSpeedP7(speed: ServoSpeed): void {
        pins.servoSetPulse(AnalogPin.P7, speed);
    }
}

//% color="#E91E63" icon="\uf0eb" block="NeoPixel"
namespace myNeoPixel {
    /**
     * Sets 5 NeoPixel LEDs on Pin P16 to RED
     */
    //% block="turn 5 NeoPixels on P16 to RED"
    //% weight=95
    export function showRedP16(): void {
        let strip = neopixel.create(DigitalPin.P16, 5, NeoPixelMode.RGB);
        strip.showColor(neopixel.colors(NeoPixelColors.Red));
    }

    /**
     * Sets NeoPixels on any chosen pin to a specific color
     */
    //% block="set %numLeds NeoPixels on pin %pin to color %color"
    //% numLeds.defl=5
    //% weight=90
    export function setStripColor(pin: BoardPin, numLeds: number, color: NeoPixelColors): void {
        let strip = neopixel.create(pin as number, numLeds, NeoPixelMode.RGB);
        strip.showColor(neopixel.colors(color));
    }

    /**
     * Clears/turns off all NeoPixels on a chosen pin
     */
    //% block="clear NeoPixels on pin %pin"
    //% weight=85
    export function clearStrip(pin: BoardPin): void {
        let strip = neopixel.create(pin as number, 64, NeoPixelMode.RGB);
        strip.clear();
        strip.show();
    }

    /**
     * Initializes a NeoPixel strip on any chosen pin with a custom number of LEDs
     */
    //% block="create NeoPixel strip on pin %pin with %numLeds LEDs"
    //% numLeds.defl=5
    //% weight=100
    export function createStripOnPin(pin: BoardPin, numLeds: number): neopixel.Strip {
        return neopixel.create(pin as number, numLeds, NeoPixelMode.RGB);
    }

    /**
     * Displays a 5-color pattern (Red, Green, Blue, Yellow, Purple) on 5 LEDs connected to P16
     */
    //% block="show 5 colors on P16"
    //% weight=94
    export function show5ColorsP16(): void {
        let strip = neopixel.create(DigitalPin.P16, 5, NeoPixelMode.RGB);
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red));
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green));
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Blue));
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Yellow));
        strip.setPixelColor(4, neopixel.colors(NeoPixelColors.Purple));
        strip.show();
    }

    /**
     * Displays a 5-color pattern on 5 LEDs on any chosen pin
     */
    //% block="show 5 colors on pin %pin"
    //% weight=89
    export function show5ColorsPin(pin: BoardPin): void {
        let strip = neopixel.create(pin as number, 5, NeoPixelMode.RGB);
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red));
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green));
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Blue));
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Yellow));
        strip.setPixelColor(4, neopixel.colors(NeoPixelColors.Purple));
        strip.show();
    }
}

//% color="#0288D1" icon="\uf043" block="Water Pump"
namespace myPump {
    /**
     * Turns the water pump connected to Pin P8 ON or OFF
     */
    //% block="set pump on P8 %on"
    //% on.shadow="toggleOnOff"
    //% weight=95
    export function setPumpP8(on: boolean): void {
        pins.digitalWritePin(DigitalPin.P8, on ? 1 : 0);
    }

    /**
     * Initializes Button A to turn the pump ON, and Button B to turn it OFF (Pin P8)
     */
    //% block="initialize pump controls on P8 (A=ON, B=OFF)"
    //% weight=85
    export function initPumpControlsP8(): void {
        input.onButtonPressed(Button.A, function () {
            pins.digitalWritePin(DigitalPin.P8, 1);
        });
        input.onButtonPressed(Button.B, function () {
            pins.digitalWritePin(DigitalPin.P8, 0);
        });
    }
}

//% color="#FF9800" icon="\uf2c7" block="Temp Sensor"
namespace tempSensor {
    /**
     * Reads temperature in Celsius from an external DS18B20 sensor connected to Pin P0
     */
    //% block="read temperature (°C) on P0"
    //% weight=90
    export function readTemperatureP0(): number {
        return dstemp.celsius(DigitalPin.P0);
    }

    /**
     * Continuously reads and displays the DS18B20 temperature from P0 on the LED matrix
     */
    //% block="continuously display temp on P0"
    //% weight=88
    export function displayTempP0(): void {
        control.inBackground(function () {
            while (true) {
                let temp = dstemp.celsius(DigitalPin.P0);
                basic.showNumber(temp);
                basic.pause(1000);
            }
        });
    }

    /**
     * Reads temperature in Celsius from Pin P3.
     * Automatically disables the LED display matrix so Pin P3 works as a clean input pin.
     */
    //% block="read temperature (°C) on P3"
    //% weight=92
    export function readTemperatureP3(): number {
        led.enable(false);
        return dstemp.celsius(DigitalPin.P3);
    }

    /**
     * Reads temperature in Celsius from an external sensor on a chosen pin
     */
    //% block="read temperature (°C) on pin %pin"
    //% weight=85
    export function readTemperature(pin: BoardPin): number {
        return dstemp.celsius(pin as number);
    }

    /**
     * Continuously logs DS18B20 temp on P3 to serial in the background. 
     * Disables the LED display to prevent signal interference on P3.
     */
    //% block="start logging DS18B20 temp on P3 to serial every %interval ms"
    //% interval.defl=1000
    //% weight=95
    export function logTempP3(interval: number): void {
        led.enable(false);
        control.inBackground(function () {
            while (true) {
                serial.writeValue("Temp", dstemp.celsius(DigitalPin.P3));
                basic.pause(interval);
            }
        });
    }
}
