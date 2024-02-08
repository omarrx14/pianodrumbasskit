import React from 'react';
import PianoKey from './PianoKey';

const Piano = () => {
    // Definir las notas de una octava en D#
    const notes = [
        { note: 'D#3', type: 'white' },
        { note: 'E#3', type: 'black' },
        { note: 'F#3', type: 'white' },
        // Añade el resto de las notas aquí
    ];

    return (
        <div className="piano">
            {notes.map(({ note, type }) => (
                <PianoKey key={note} note={note} type={type} />
            ))}
        </div>
    );
};

export default Piano;
