import React, { useEffect, useRef } from 'react';
import DrumPad from './drumpads1';
import * as Tone from 'tone';


const drumTriggers = [
    { trigger: 'Q', label: 'Kick', note: 'C2' },
    { trigger: 'W', label: 'Snare', note: 'D2' },
    { trigger: 'E', label: 'Tom', note: 'F2' },
    { trigger: 'R', label: 'Clap', note: 'D4' },
    { trigger: 'T', label: 'Hihat', note: 'G2' },



    // ... otros triggers para tu drumkit
];

const DrumKit = () => {
    const synthRef = useRef(null);

    useEffect(() => {
        synthRef.current = new Tone.MembraneSynth().toDestination();
    }, []);

    const playSound = async (note) => {
        await Tone.start();
        synthRef.current.triggerAttackRelease(note, "8n");
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const drumPad = drumTriggers.find(d => d.trigger === event.key.toUpperCase());
            if (drumPad) {
                playSound(drumPad.note);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    // Función para probar el sonido del piano
    const testSound = () => {
        playSound('C4');
        setTimeout(() => playSound('C2'), 500);
        setTimeout(() => playSound('D2'), 1000);
        setTimeout(() => playSound('F2'), 1500);


    };

    return (
        <div className="drum-kit">
            <button onClick={testSound}>Probar Sonido</button>
            {drumTriggers.map((drum, index) => (
                <DrumPad key={index} note={drum.note} playSound={playSound} label={drum.label} />

            ))}
        </div>
    );
};

export default DrumKit;


