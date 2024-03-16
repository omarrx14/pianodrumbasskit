import React, { useRef, useEffect, useCallback, useState } from 'react';
import './PianoVisual.css'
import { audioModule } from '../../audiocontext/AudioModule';

const PianoCanvas = () => {
    const canvasRef = useRef(null);
    const [activeKey, setActiveKey] = useState(null); // Nuevo estado para la tecla activa

    const noteNames = [
        "C0", "C#0 / Db0", "D0", "D#0 / Eb0", "E0", "F0", "F#0 / Gb0", "G0", "G#0 / Ab0", "A0", "A#0 / Bb0", "B0",
        "C1", "C#1 / Db1", "D1", "D#1 / Eb1", "E1", "F1", "F#1 / Gb1", "G1", "G#1 / Ab1", "A1", "A#1 / Bb1", "B1",
        "C2", "C#2 / Db2", "D2", "D#2 / Eb2", "E2", "F2", "F#2 / Gb2", "G2", "G#2 / Ab2", "A2", "A#2 / Bb2", "B2",
        "C3", "C#3 / Db3", "D3", "D#3 / Eb3", "E3", "F3", "F#3 / Gb3", "G3", "G#3 / Ab3", "A3", "A#3 / Bb3", "B3",
        "C4", "C#4 / Db4", "D4", "D#4 / Eb4", "E4", "F4", "F#4 / Gb4", "G4", "G#4 / Ab4", "A4", "A#4 / Bb4", "B4",
        "C5", "C#5 / Db5", "D5", "D#5 / Eb5", "E5", "F5", "F#5 / Gb5", "G6", "G#6 / Ab5", "A5", "A#5 / Bb5", "B5",
        "C6", "C#6 / Db6", "D6", "D#6 / Eb6", "E6", "F6", "F#6 / Gb6", "G7", "G#7 / Ab6", "A6", "A#6 / Bb6", "B6",
        "C7", "C#7 / Db7", "D7", "D#7 / Eb7", "E7", "F7", "F#7 / Gb7", "G8", "G#8 / Ab7", "A7", "A#7 / Bb7", "B7",


    ];

    const keyHeight = 25; // Altura de cada tecla
    const keyWidth = 150; // Ancho de cada tecla
    const totalKeys = 88; // Total de teclas en un piano

    // Dibuja una tecla en el canvas
    const drawKey = useCallback((ctx, y, color, note, index) => {
        ctx.fillStyle = index === activeKey ? 'blue' : color; // Cambia el color si la tecla está activa
        ctx.fillRect(0, y, keyWidth, keyHeight);
        ctx.strokeRect(0, y, keyWidth, keyHeight);

        ctx.fillStyle = 'red';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(note, keyWidth / 2, y + keyHeight / 2 + 5);
    }, [activeKey]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Asegura que el audio esté listo antes de permitir la interacción
        // audioModule.startAudio();

        // Dibuja todas las teclas al inicio
        noteNames.forEach((note, i) => {
            const color = note.includes('#') ? 'black' : 'white';
            const yPosition = i * keyHeight;
            drawKey(ctx, yPosition, color, note, i);
        });
    }, [drawKey, noteNames]);

    // Maneja el clic en el canvas, determinando qué tecla fue presionada
    const handleCanvasClick = useCallback((event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const y = event.clientY - rect.top; // Coordenada y del clic
        const keyIndex = Math.floor(y / keyHeight); // Índice de la tecla clicada

        if (keyIndex < totalKeys) {
            setActiveKey(keyIndex); // Establece la tecla como activa para cambiar su color
            const note = noteNames[keyIndex];
            audioModule.synth.triggerAttackRelease(note, "8n"); // Reproduce la nota
            setTimeout(() => setActiveKey(null), 200); // Opcional: resetea la tecla activa después de un breve periodo
        }
    }, [totalKeys, noteNames]);

    return <canvas className='pianocanvas' ref={canvasRef} width={keyWidth} height={keyHeight * totalKeys} onClick={handleCanvasClick} />;
};

export default PianoCanvas;
