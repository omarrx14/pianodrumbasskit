// Componente DrumPad2
import React from 'react';

const DrumPad2 = ({ label, playSound }) => {
    return (

        <div className="drum-pad" onClick={playSound}>
            {label}
        </div>
    );
};

export default DrumPad2;
