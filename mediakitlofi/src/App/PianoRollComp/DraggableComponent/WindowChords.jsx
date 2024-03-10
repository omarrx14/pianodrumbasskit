import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import * as Tone from 'tone';
import './chordsball.css';
// import DropArea from './Dropzone';
import { Timeline } from '../Visualizer_Temp/Timeline.tsx';
// import PianoRoll from './pianorollcontainer.js';

// Componente de acorde individual
const ChordBalloon = ({ chord, onClick }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'chord',
        item: { chord },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={dragRef} className="chord-balloon" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={() => onClick(chord)}>
            {chord.name}
        </div>
    );
};

// Memorizamos el componente ChordBalloon para evitar re-renderizados innecesarios
const MemoizedChordBalloon = React.memo(ChordBalloon);

const ChordBalloons = ({ chords }) => {
    // Inicia el sintetizador de Tone.js
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();


    // Manejador de clic para los acordes
    const handleChordClick = (chord) => {
        // Reproduce el acorde utilizando Tone.js
        synth.triggerAttackRelease(chord.notes, '1n');
    };



    return (
        <div className="chord-balloons-container">

            {/* <div className="chord-balloons">
                {chords.map((chord, index) => (
                    <MemoizedChordBalloon
                        key={index}
                        chord={chord}
                        onClick={handleChordClick}
                    />
                ))}
            </div> */}
            {/* <DropArea /> Añade el componente DropArea */}
            <Timeline />
            {/* <PianoRoll /> */}
            {/* <webaudio-pianoroll id="proll" width="800" height="320"></webaudio-pianoroll> */}

        </div>
    );
};

// Definimos algunos acordes de ejemplo para visualizar
const chords = [
    { name: 'C Major', notes: ['C4', 'E4', 'G4'] },
    { name: 'A Minor', notes: ['A3', 'C4', 'E4'] },
    { name: 'G Major', notes: ['G3', 'B3', 'D4'] },
    { name: 'E Minor', notes: ['E3', 'G3', 'B3'] },
    { name: 'D Major', notes: ['D3', 'F#3', 'A3'] },
];

// Exportamos ChordBalloons pasándole los acordes definidos
export default () => <ChordBalloons chords={chords} />;
