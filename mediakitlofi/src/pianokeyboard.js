import React, { useEffect, useRef } from 'react';
import PianoKey from './Pianokey';
import * as Tone from 'tone';


const octaves = [
    ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], // Octava 2
    ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], // Octava 3
    ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], // Octava 4
    ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], // Octava 5
];

const keyNoteMapping = {
    'a': 'C4',
    's': 'D4',
    'd': 'E4',
    'f': 'F4',
    'g': 'G4',
    'y': 'G#4',
    'h': 'A4',
    '+': 'G5',
    ',': 'G#5',
    '.': 'A5',
    '/': 'A#5',
    'Shift': 'B5',
};

const Piano = () => {
    const synthRef = useRef(null);

    useEffect(() => {
        synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }, []);

    const playNote = async (note) => {
        await Tone.start();
        synthRef.current.triggerAttackRelease(note, "8n");
    };

    useEffect(() => {
        const onMIDIMessage = (message) => {
            const command = message.data[0];
            const noteNumber = message.data[1];
            const velocity = (message.data.length > 2) ? message.data[2] : 0;

            if (command === 144 && velocity > 0) {
                const noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                const octave = Math.floor(noteNumber / 12);
                const keyNote = noteMap[noteNumber % 12] + octave;
                playNote(keyNote);
            }
        };

        const enableMIDI = async () => {
            try {
                const midiAccess = await navigator.requestMIDIAccess({ sysex: false });
                for (const input of midiAccess.inputs.values()) {
                    input.onmidimessage = onMIDIMessage;
                }
            } catch (error) {
                console.error("No se pudo acceder a los dispositivos MIDI.", error);
            }
        };

        const handleKeyDown = (event) => {
            if (keyNoteMapping[event.key]) {
                playNote(keyNoteMapping[event.key]);
            }
        };

        enableMIDI();
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    // Función para probar el sonido del piano
    const testSound = () => {
        playNote('C4');
        setTimeout(() => playNote('E4'), 500);
        setTimeout(() => playNote('G4'), 1000);
        setTimeout(() => playNote('C4'), 1500);


    };


    return (
        <div className="piano">
            <button onClick={testSound}>Probar Sonido</button>
            {octaves.map((octave, octaveIndex) =>
                octave.map((note) => {
                    const fullNote = note + (octaveIndex + 1);
                    return (
                        <PianoKey
                            key={fullNote}
                            note={fullNote}
                            isBlack={note.includes('#')}
                            playNote={() => playNote(fullNote)}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Piano;
