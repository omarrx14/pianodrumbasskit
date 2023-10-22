import React from 'react';

const DrumPad = ({ note, label, playSound }) => {
    return (
        <div className="drum-pad" onClick={() => playSound(note)}>
            {label}
        </div>
    );
};

export default DrumPad;
