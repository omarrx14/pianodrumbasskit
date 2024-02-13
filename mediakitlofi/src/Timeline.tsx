// Timeline.tsx
import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addChord, togglePlay, setCurrentTime, updateMatrix, setBpm, setPosition, insertInMatrix, notes, setSelectedCellsCount, moveBlock } from './timelineslice.ts'; // Importa las acciones necesarias
import * as Tone from 'tone';
import './timeline.css';
import './pianokey1.css';
import PianoRoll from './pianopixiroll.js';
import Cell from './Cell.tsx';
import './pianroll.css'; // Asegúrate de crear este archivo CSS para estilizar tu piano roll
import SliderComponent from './sliderui.js';
import Bar from './bar1.tsx';


import PianoKey from './Pianokeys1.js';



export const Timeline: React.FC = () => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const dispatch = useDispatch();
    const { chords, isPlaying, currentTime, matrix, pianoRoll } = useSelector((state) => state.timeline);
    const [bpm, setBpm] = useState(120); // Valor inicial de 120 BPM
    const [isDragging] = useState(false);
    const [draggingBar, setDraggingBar] = useState(null);

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

    const transformNoteStartTime = (compass, corchea) => {
        return `${compass}:${corchea}`
    }

    const notesToTonejsNotes = () => {
        const values = Object.entries(pianoRoll).map(([clave, valor]) => {
            return {
                note: valor.note,
                time: transformNoteStartTime(valor.compass, valor.corchea),
                duration: calcularDuracionToneJs(valor.duration)
            };
        });

        console.log(values)
        return values;
    }


    // useEffect(() => {
    //     const tonejsNotes = notesToTonejsNotes()
    //     // Asegúrate de que Tone.js esté listo
    //     Tone.start();

    //     // Crea un sintetizador
    //     const synth = new Tone.Synth().toDestination();
    //     const parte = new Tone.Part((time, value) => {
    //         synth.triggerAttackRelease(value.note, value.duration, time);
    //     }, tonejsNotes).start(0);

    //     // Configura el tempo (BPM)
    //     Tone.Transport.bpm.value = 120;

    //     // Inicia el transporte para tocar las notas
    //     Tone.Transport.start();
    // }, [pianoRoll]);


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
        // dispatch(togglePlay(true));
        // Tone.start(); // Necesario para iniciar la reproducción de audio con Tone.js

        const toneJSNotes = notesToTonejsNotes(pianoRoll)
        // Asegúrate de que Tone.js esté listo
        Tone.start();

        // Crea un sintetizador
        // const synth = new Tone.Synth().toDestination();
        const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
        const parte = new Tone.Part((time, value) => {
            polySynth.triggerAttackRelease(value.note, value.duration, time);
        }, toneJSNotes).start(0);

        // Configura el tempo (BPM)
        Tone.Transport.bpm.value = 120;

        // Inicia el transporte para tocar las notas
        Tone.Transport.start();
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

    function calcularDuracionToneJs(cuadritos) {
        // Cada cuadrito es una semicorchea ("16n")
        if (cuadritos === 1) {
            return "16n"; // Un cuadrito es directamente una semicorchea
        } else if (cuadritos % 4 === 0) {
            // Si la cantidad de cuadritos es un múltiplo de 4, entonces es una corchea ("8n"), negra ("4n"), etc.
            const division = cuadritos / 4;
            if (division === 1) return "4n"; // Negra
            else if (division === 2) return "2n"; // Blanca
            else if (division === 4) return "1n"; // Redonda
            // Puedes continuar para duraciones más largas si es necesario
        } else {
            // Para duraciones que no encajan perfectamente en la notación estándar
            // Podemos simplemente devolver la duración en "Tone.Ticks" o manejar casos específicos
            // Aquí puedes añadir lógica específica si hay duraciones comunes que deseas manejar
            return cuadritos * Tone.Ticks("16n").valueOf() + "i"; // "i" al final significa ticks
        }

        // Caso por defecto, devuelve la cantidad de cuadritos como ticks si no se cumple ninguna condición
        return cuadritos * Tone.Ticks("16n").valueOf() + "i";
    }

    const handleCellClick = (rowIndex, colIndex) => {
        const octavaC4aB4 = {
            0: "C4",
            1: "C#4 / Db4",
            2: "D4",
            3: "D#4 / Eb4",
            4: "E4",
            5: "F4",
            6: "F#4 / Gb4",
            7: "G4",
            8: "G#4 / Ab4",
            9: "A4",
            10: "A#4 / Bb4",
            11: "B4"
        };
        const note = octavaC4aB4[rowIndex];


        dispatch(insertInMatrix({ rowIndex, columnIndex: colIndex, note }));
    };

    const handleBarClick = (rowIndex) => {
        console.log(`Bar clicked at row ${rowIndex}`);
        // Aquí puedes establecer el estado para indicar que un Bar ha sido seleccionado
        // y potencialmente iniciar la lógica para mover el Bar.
        const onDragStart = (event, rowIndex) => {
            setDraggingBar(rowIndex);
            event.dataTransfer.effectAllowed = "move";
        };

        const onDrop = (event, targetRowIndex) => {
            if (draggingBar !== null && draggingBar !== targetRowIndex) {
                // Implementa la lógica para "mover" el Bar desde draggingBar a targetRowIndex
                // Esto podría implicar actualizar el estado de la matriz para reflejar el nuevo orden de las celdas
                dispatch(moveBlock({ rowIndex: draggingBar, colIndex: 0, targetRowIndex }));

                setDraggingBar(null); // Resetea el estado de arrastre
            }
        };

        const onDragOver = (event) => {
            event.preventDefault(); // Permite que el drop sea aceptado
        };
    };




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
            <div ref={drop} className="pianoRoll">


                {/* Renderiza la matriz de acordes */}
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="timeline-row">

                        {row.map((notes, colIndex,) => (
                            <Cell key={`${rowIndex} - ${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} notes={notes}
                                onClick={() => handleCellClick(rowIndex, colIndex,)}

                            />
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

