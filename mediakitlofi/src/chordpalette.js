import React from 'react';
import { useDrag } from 'react-dnd';
import * as Tone from 'tone';
import './chordsball.css';

// Componente de acorde arrastrable
const DraggableChordButton = ({ chord, onClick }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "chord",
        item: { chord },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }} onClick={() => onClick(chord)}>
            {chord.name}
        </div>
    );
};

const ChordBalloons = ({ chords }) => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();

    const handleChordClick = (chord) => {
        synth.triggerAttackRelease(chord.notes, '1n');
    };

    return (
        <div className="chord-balloons-container">
            <div className="chord-balloons">
                {chords.map((chord, index) => (
                    <DraggableChordButton
                        key={index}
                        chord={chord}
                        onClick={handleChordClick}
                    />
                ))}
            </div>
        </div>
    );
};

const chords = [
    { name: 'C Major', notes: ['C4', 'E4', 'G4'] },
    // ... otros acordes
];

export default () => <ChordBalloons chords={chords} />;
