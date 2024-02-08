import React from 'react';
import * as Tone from 'tone';

// Crear una instancia de PolySynth fuera del componente para evitar
// recreaciones en cada render. Idealmente, esto debería ser manejado
// en un contexto más alto y pasarse como prop.
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

const PianoKey = ({ note, type }) => {
    const playNote = () => {
        // Ahora simplemente activamos la nota en el PolySynth
        synth.triggerAttackRelease(note, "0.5");
    };

    const keyClass = `piano-key ${type === 'white' ? 'white-key' : 'black-key'}`;

    return (
        <div onClick={playNote} className={keyClass}>
            {note}
        </div>
    );
};

export default PianoKey;