import React from 'react';



const PianoKey = ({ note, isBlack, playNote }) => {
    const handleClick = () => {
        playNote(note);
    };

    return (
        <div className={`key ${isBlack ? 'black-key' : 'white-key'}`} onClick={handleClick}>
            <div className="note-label">{note}</div>
        </div>
    );
};

export default PianoKey;
