// Timeline.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addChord, togglePlay, setCurrentTime, updateMatrix } from './timelineslice.ts'; // Importa las acciones necesarias
import * as Tone from 'tone';
import './timeline.css';


export const Timeline: React.FC = () => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const dispatch = useDispatch();
<<<<<<< Updated upstream
    const { chords, isPlaying, currentTime, matrix } = useSelector((state) => state.timeline);
    const [bpm, setBpm] = useState(120); // Valor inicial de 120 BPM
=======
    const { chords, isPlaying, currentTime, matrix, pianoRoll, notes, setNotes, moveNote } = useSelector((state) => state.timeline);
    // const [bpm, setBpm] = useState(120); // Valor inicial de 120 BPM
    const [draggingBar, setDraggingBar] = useState(null);
    const [seleccionActual, setSeleccionActual] = useState(null);
    const { slots } = useSelector((state) => state.timeline);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const canvasRef = useRef(null);
>>>>>>> Stashed changes

    console.log('Matrix State:', matrix); // Ver el estado actual de la matriz

    // const calculateNotePosition = (event) => {
    //     const canvasRect = canvasRef.current.getBoundingClientRect();
    //     const x = event.clientX - canvasRect.left; // Coordenada X del mouse relativa al canvas
    //     const y = event.clientY - canvasRect.top; // Coordenada Y del mouse relativa al canvas

    //     const colIndex = Math.floor(x / cellSize); // Asumiendo que 'cellSize' es el ancho de las celdas
    //     const rowIndex = Math.floor(y / cellSize); // Asumiendo que 'cellSize' es el alto de las celdas

    //     return { rowIndex, colIndex };
    // };


<<<<<<< Updated upstream

    const CELL_WIDTH = 25; // Ancho de cada celda
    const CELL_HEIGHT = 25; // Alto de cada celda

    const calculateRow = (y) => {
        // Asegúrate de que 'y' no exceda las dimensiones del timeline
        const maxY = 300; // Altura del timeline
        const adjustedY = Math.min(y, maxY - 1);
        return Math.floor(adjustedY / CELL_HEIGHT);
    };

    const calculateCol = (x) => {
        // Asegúrate de que 'x' no exceda las dimensiones del timeline
        const maxX = 500; // Ancho del timeline
        const adjustedX = Math.min(x, maxX - 1);
        return Math.floor(adjustedX / CELL_WIDTH);
    };
=======
    const pianoNotes = [
        { note: "C4", type: "white", velocity: ".05" }, { note: "C#4", type: "black" }, { note: "D4", type: "white" },
        { note: "D#4", type: "black" }, { note: "E4", type: "white" }, { note: "F4", type: "white" },
        { note: "F#4", type: "black" }, { note: "G4", type: "white" }, { note: "G#4", type: "black" },
        { note: "A4", type: "white" }, { note: "A#4", type: "black" }, { note: "B4", type: "white" }
    ];
>>>>>>> Stashed changes


    // const handleMouseDownOnGrid = (event) => {
    //     setIsDragging(true);
    //     const { rowIndex, colIndex } = calculateNotePosition(event);

    //     // Suponiendo que tienes una manera de determinar si una nota existe en esta posición
    //     const note = findNoteAtPosition(rowIndex, colIndex);
    //     if (note) {
    //         setSelectedNote(note);
    //     }
    // };


    // const handleMouseMoveOnGrid = (event) => {
    //     if (!isDragging || !selectedNote) return;

    //     const { rowIndex, colIndex } = calculateNotePosition(event);

    //     // Aquí podrías despachar una acción Redux o actualizar el estado local para mover la nota
    //     // Por ejemplo:
    //     dispatch(moveNote({
    //         noteId: selectedNote.id,
    //         newRowIndex: rowIndex,
    //         newColIndex: colIndex
    //     }));
    // };

    // const handleMoveNote = (noteId, clientX, clientY) => {
    //     // Supongamos que tienes una función que convierte las coordenadas del mouse a índices de fila y columna
    //     const { newRowIndex, newColIndex } = convertMousePositionToGridIndex(clientX, clientY);

    //     // Despachar la acción de mover nota con los índices calculados
    //     dispatch(moveNote({ noteId, newRowIndex, newColIndex }));
    // };

    // const handleMouseUp = () => {
    //     setIsDragging(false);
    //     setSelectedNote(null); // Opcionalmente, puedes deseleccionar la nota aquí
    // };


    // useEffect(() => {
    //     // Añadir listener para manejar el final del arrastre en todo el documento
    //     document.addEventListener('mouseup', handleMouseUp);
    //     return () => {
    //         document.removeEventListener('mouseup', handleMouseUp);
    //     };
    // }, [selectedNote]);


    // useEffect(() => {
    //     if (isPlaying) {
    //         const interval = setInterval(() => {
    //             const nextTime = currentTime + 1;
    //             console.log('Current Time:', nextTime); // Ver el tiempo actual

<<<<<<< Updated upstream
    //             dispatch(setCurrentTime(nextTime));
    //             playChordsAtTime(nextTime);
    //         }, 1000); // Ajusta según tu tempo
=======
    const transformNoteStartTime = (compass, corchea) => {
        const beats = Math.floor(corchea / 4);
        const sixteenths = corchea % 4;
        return `${compass}:${beats}:${sixteenths}`;
    }


    const notesToTonejsNotes = () => {
        const values = notes.map((note) => {
            return {
                note: note.pitch, // Usar 'pitch' como la nota musical
                duration: calcularDuracionToneJs(note.cellDuration),
                velocity: 0.8, // Usar 'velocity' para la velocidad de la nota
                time: transformNoteStartTime(note.compass, note.corchea),
            };
        });

        console.log(values);
        return values;
    }
>>>>>>> Stashed changes

    //         return () => clearInterval(interval);
    //     }
    // }, [isPlaying, currentTime, dispatch]);


    useEffect(() => {
        if (isPlaying) {
<<<<<<< Updated upstream
            const intervalTime = (60 / bpm) * 1000; // Convertir BPM a intervalo en milisegundos
            const interval = setInterval(() => {
                const nextTime = currentTime + 1;
                dispatch(setCurrentTime(nextTime));
                playChordsAtTime(nextTime);
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [isPlaying, currentTime, bpm, dispatch]);
=======

        }
    }, [isPlaying, currentTime, setPosition, dispatch]);
>>>>>>> Stashed changes


    const playChordsAtTime = (time) => {
        // Iterar a través de cada fila de la matriz
        matrix.forEach((row, rowIndex) => {
            // Obtener el acorde en la columna que corresponde al tiempo actual
            const cell = row[time];
            if (cell && cell.chord) {
                // Reproducir el acorde si existe en la celda actual
                synth.triggerAttackRelease(cell.chord.notes, '1n');
            }
        });
    };
<<<<<<< Updated upstream
=======
    useEffect(() => {
        // Iniciar audio con tu módulo personalizado
        audioModule.startAudio();

        // Opcionalmente, inicializar Tone.js aquí si es necesario para tu caso de uso específico
        // Tone.start().then(() => {
        //     console.log('Tone.js está listo');
        // });

        // Función de limpieza al desmontar el componente
        return () => {
            // Detener el transporte de Tone.js y limpiar
            audioModule.stopSequence();

            // Aquí también puedes incluir cualquier otra limpieza necesaria para tu módulo de audio
        };
    }, []);


    const handlePlay = async () => {
        // await Tone.start();
        const toneJSNotes = notesToTonejsNotes(notes);


        // Tone.Transport.start();
        audioModule.startSequence(toneJSNotes);
>>>>>>> Stashed changes

    const handlePlay = () => {
        dispatch(togglePlay(true));
        Tone.start(); // Necesario para iniciar la reproducción de audio con Tone.js
    };

    const handleStop = () => {
        dispatch(togglePlay(false));
    };



<<<<<<< Updated upstream
=======

    const calcularDuracionToneJs = (duracionCeldas) => {
        // Esta función convierte la duración en número de celdas a una duración musical
        // Por ejemplo, si cada celda representa una semicorchea ("16n"), entonces:
        switch (duracionCeldas) {
            case 1: return "16n";
            case 2: return "8n";
            case 3: return "8n."; // Punto añade la mitad de la duración de la nota
            case 4: return "4n";
            // Añade más casos según tu lógica de mapeo
            default: return "16n"; // Caso por defecto o ajusta según necesites
        }
    }


    // Ejemplo de uso
    console.log(calcularDuracionToneJs(4)); // Debería devolver "4n"
    console.log(calcularDuracionToneJs(8)); // Debería devolver "2n"
    console.log(calcularDuracionToneJs(3)); // Devuelve "16n,16n,16n" como








    // const odeToJoyPatterns = {
    //     melody: [
    //         // Parte inicial de la melodía de "Ode to Joy"
    //         ['0:0:0', 'E4'],
    //         ['0:0:2', 'E4'],
    //         ['0:1:0', 'F4'],
    //         ['0:1:2', 'G4'],
    //         ['0:2:0', 'G4'],
    //         ['0:2:2', 'F4'],
    //         ['0:3:0', 'E4'],
    //         ['0:3:2', 'D4'],
    //         ['1:0:0', 'C4'],
    //         ['1:0:2', 'C4'],
    //         ['1:1:0', 'D4'],
    //         ['1:1:2', 'E4'],
    //         ['1:2:0', 'E4'],
    //         ['1:2:2', 'D4'],
    //         ['1:3:0', 'D4'],
    //         // Repite o continúa la melodía según sea necesario
    //     ],
    //     // Puedes agregar acordes o acompañamiento si lo deseas
    // };

    // let melodyPart = new Tone.Part((time, note) => {
    //     synth.triggerAttackRelease(note, '8n', time);
    // }, odeToJoyPatterns.melody).start(0);

    // melodyPart.loop = true;
    // melodyPart.loopStart = 0;
    // melodyPart.loopEnd = '2:0:0';

    const handleChangeBpm = (e) => {
        const newBpm = Number(e.target.value);
        setBpmLocal(newBpm);
        dispatch(setBpmAction(newBpm)); // Actualiza el BPM en Redux
    };
>>>>>>> Stashed changes

    return (
        <div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
            {/* <button onclick="Play()">Play</button> */}

<<<<<<< Updated upstream
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
=======
            <div className="pianoRoll">
                <Gridtest
                // handleMouseDownOnGrid={handleMouseDownOnGrid}
                // handleMouseMoveOnGrid={handleMouseMoveOnGrid}

                />
            </div>
            {/* 
>>>>>>> Stashed changes
            <div>
                <label htmlFor="bpm">BPM:</label>
                <input
                    type="number"
                    id="bpm"
<<<<<<< Updated upstream
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                />
            </div>
        </div >
=======
                    // value={bpm}
                    onChange={handleChangeBpm}
                />
            </div> */}
        </div>
>>>>>>> Stashed changes
    );
};
