import React from 'react';
import * as Tone from 'tone';

const PianoKey = ({ note, type }) => {
    const playNote = () => {
        const oscillator = new Tone.Oscillator(note, "sine").toDestination();
        oscillator.start();
        oscillator.stop("+0.5");
    };

    const keyClass = `piano-key ${type === 'white' ? 'white-key' : 'black-key'}`;

    return (
        <div onClick={playNote} className={keyClass}>
            {note}
        </div>
    );
};

export default PianoKey;
