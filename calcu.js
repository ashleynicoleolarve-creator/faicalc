const display = document.querySelector('.inputValue');


// BUTTON CLICK SOUND

let audioContext;

function playSound() {

    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    oscillator.type = 'sine';

    oscillator.frequency.setValueAtTime(
        650,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.12,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.08
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.08
    );

}


// INSERT NUMBERS AND OPERATORS

function insert(value) {

    playSound();

    if (display.value === 'Error') {
        display.value = '';
    }

    display.value += value;

}


// CLEAR DISPLAY

function clearDisplay() {

    playSound();

    display.value = '';

}


// BACKSPACE

function backspace() {

    playSound();

    display.value = display.value.slice(0, -1);

}


// CALCULATE RESULT

function equal() {

    playSound();

    try {

        let expression = display.value;

        if (expression.trim() === '') {
            return;
        }

        // ALLOW ONLY CALCULATOR CHARACTERS

        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error('Invalid');
        }

        // CONVERT PERCENTAGE

        expression = expression.replace(
            /(\d+(?:\.\d+)?)%/g,
            '($1/100)'
        );

        // COMPUTE RESULT

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error('Invalid');
        }

        display.value = Number.isInteger(result)
            ? result
            : parseFloat(result.toFixed(8));

    }

    catch (error) {

        display.value = 'Error';

    }

}
