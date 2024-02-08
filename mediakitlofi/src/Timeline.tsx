// Timeline.tsx
import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addChord, togglePlay, setCurrentTime, updateMatrix, setBpm, setPosition } from './timelineslice.ts'; // Importa las acciones necesarias
import * as Tone from 'tone';
import './timeline.css';
import './pianokey1.css';
import PianoRoll from './pianorollcontainer.js';
import PianoKey from './Pianokeys1.js';



export const Timeline: React.FC = () => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const dispatch = useDispatch();
    const { chords, isPlaying, currentTime, matrix } = useSelector((state) => state.timeline);
    const [bpm, setBpm] = useState(120); // Valor inicial de 120 BPM

    console.log('Matrix State:', matrix); // Ver el estado actual de la matriz

    const [, drop] = useDrop({
        accept: 'chord',
        drop: (item: any, monitor) => {
            console.log('Dropped item:', item); // Ver el objeto arrastrado

            const clientOffset = monitor.getClientOffset();
            console.log('Client Offset:', clientOffset); // Ver la posición del evento de soltar

            if (clientOffset) {
                const row = calculateRow(clientOffset.y);
                const col = calculateCol(clientOffset.x);
                console.log('Calculated row and col:', row, col); // Ver la fila y columna calculadas

                dispatch(updateMatrix({ chord: item.chord, row, col }));
            }
        },
    });

    const pianoNotes = [
        { note: "C4", type: "white" }, { note: "C#4", type: "black" }, { note: "D4", type: "white" },
        { note: "D#4", type: "black" }, { note: "E4", type: "white" }, { note: "F4", type: "white" },
        { note: "F#4", type: "black" }, { note: "G4", type: "white" }, { note: "G#4", type: "black" },
        { note: "A4", type: "white" }, { note: "A#4", type: "black" }, { note: "B4", type: "white" }
    ];

    const CELL_WIDTH = 50; // Ancho de cada celda
    const CELL_HEIGHT = 20; // Alto de cada celda

    const calculateRow = (y) => {
        // Asegúrate de que 'y' no exceda las dimensiones del timeline
        const maxY = 300; // Altura del timeline
        const adjustedY = Math.min(y, maxY - 1);
        return Math.floor(adjustedY / CELL_HEIGHT);
    };

    const calculateCol = (x) => {
        // Asegúrate de que 'x' no exceda las dimensiones del timeline
        const maxX = 650; // Ancho del timeline
        const adjustedX = Math.min(x, maxX - 1);
        return Math.floor(adjustedX / CELL_WIDTH);
    };




    useEffect(() => {
        if (isPlaying) {
            const intervalTime = (60 / bpm) * 1000; // Convertir BPM a intervalo en milisegundos
            const interval = setInterval(() => {
                const nextTime = currentTime + 1;


                playChordsAtTime(nextTime);
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [isPlaying, currentTime, bpm, setPosition, dispatch]);


    const playChordsAtTime = (time) => {
        // Iterar a través de cada fila de la matriz
        matrix.forEach((row, rowIndex) => {
            // Obtener el acorde en la columna que corresponde al tiempo actual
            const cell = row[time];
            if (cell && cell.chord) {
                // Reproducir el acorde si existe en la celda actual
                synth.triggerAttackRelease(cell.chord.notes, '8n');
            }
        });
    };

    const handlePlay = () => {
        dispatch(togglePlay(true));
        Tone.start(); // Necesario para iniciar la reproducción de audio con Tone.js
    };

    const handleStop = () => {
        dispatch(togglePlay(false));
    };

    const handleBpmChange = (newBpm) => {
        Tone.Transport.bpm.value = newBpm;
        dispatch(setBpm(newBpm)); // Asume que setBpm es una acción de Redux
    };

    const handlePositionChange = (newPosition) => {
        Tone.Transport.position = newPosition;
        dispatch(setPosition(newPosition));
    };

    // const PianoRoll = ({ canvasRef, state, onPlayToggle }) => {
    //     useEffect(() => {
    //         if (canvasRef.current) {
    //             PianoRoll({
    //                 view: canvasRef.current,
    //                 playing: state.playing,
    //                 time: state.time,
    //                 bpm: state.bpm,
    //                 zoom: state.zoom,
    //                 resolution: state.resolution,
    //                 noteData: state.noteData,
    //                 onPlayToggle,
    //             });
    //         }
    //     }, [state, canvasRef]);

    //     return <canvas ref={canvasRef} />;
    // };


    return (

        <div>
            <div className="piano">
                {pianoNotes.map(({ note, type }) => (
                    <PianoKey key={note} note={note} type={type} />
                ))}
            </div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
            {/* <button onclick="Play()">Play</button> */}
            {/* <PianoRoll /> */}
            <div ref={drop} className="timeline">

                <div className="current-position" style={{ left: `${currentTime * CELL_WIDTH}px` }}></div>

                {/* Renderiza la matriz de acordes */}
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="timeline-row">
                        {row.map((cell, colIndex) => (

                            <div key={colIndex} className="timeline-cell">
                                {cell.chord && <div className="chord">{cell.chord.name}</div>}
                            </div>
                        ))}
                    </div>
                ))}

                {/* Renderiza los acordes existentes */}
                {chords.map((chord, index) => (
                    <div key={index} className="note" style={{ left: `${chord.position}px` }}>
                        {chord.name}
                    </div>
                ))}
            </div>
            <div>
                <label htmlFor="bpm">BPM:</label>
                <input
                    type="number"
                    id="bpm"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                />
            </div>
        </div >
    );
};
