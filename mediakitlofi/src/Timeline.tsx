// Timeline.tsx
import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { insertInMatrix, notes } from './timelineslice.ts'; // Importa las acciones necesarias
import * as Tone from 'tone';
import './timeline.css';
import './pianokey1.css';
import PianoRoll from './pianopixiroll.js';
import Cell from './Cell.tsx';
import './pianroll.css'; // Asegúrate de crear este archivo CSS para estilizar tu piano roll
import Bar from './bar1.tsx';
import { Gridtest } from './Gridtest.tsx';
import { GridTest } from './App/components/Grudtest.jsx';
import { audioModule } from './App/audiocontext/AudioModule.js'; // Asumiendo que este es el módulo de audio


import PianoKey from './Pianokeys1.js';
import { NOTES } from './note.ts';



export const Timeline: React.FC = () => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const dispatch = useDispatch();
    const { chords, isPlaying, currentTime, matrix, pianoRoll, notes } = useSelector((state) => state.timeline);
    const [bpm, setBpm] = useState(120); // Valor inicial de 120 BPM
    const [isDragging] = useState(false);
    const [draggingBar, setDraggingBar] = useState(null);
    const [seleccionActual, setSeleccionActual] = useState(null);
    const { slots } = useSelector((state) => state.timeline);


    console.log('Matrix State:', notes); // Ver el estado actual de la matriz

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
        { note: "C5", type: "white", velocity: ".05" }, { note: "C#4", type: "black" }, { note: "D4", type: "white" },
        { note: "D#4", type: "black" }, { note: "E4", type: "white" }, { note: "F4", type: "white" },
        { note: "F#4", type: "black" }, { note: "G4", type: "white" }, { note: "G#4", type: "black" },
        { note: "A4", type: "white" }, { note: "A#4", type: "black" }, { note: "B4", type: "white" }
    ];




    const transformNoteStartTime = (compass, corchea) => {
        // Asumiendo que cada "corchea" representa una semicorchea en términos de Tone.js
        // y que quieres convertir esto en un formato de "Bars:Beats:Sixteenths"
        const beats = Math.floor(corchea / 4);
        const sixteenths = corchea % 4;
        return `${compass}:${beats}:${sixteenths}`;
    }

    const notesToTonejsNotes = () => {
        const values = Object.entries(notes).map(([clave, note]) => {
            return {
                note: note.pitch, // Usar 'pitch' como la nota musical
                duration: calcularDuracionToneJs(note.units),
                velocity: note.velocity, // Usar 'velocity' para la velocidad de la nota
                // Asegúrate de calcular o ajustar 'time' si es necesario. Aquí simplemente se usa un valor de ejemplo.
                // time: note.startTime // Asumir
                // duration: calcularDuracionToneJs(note.duration), // Asumiendo que 'duration' ya está en un formato aceptable o necesitas ajustar esta lógica
                time: transformNoteStartTime(note.compass, note.corchea),

            };
        });

        console.log(values)
        return values;
    }


    useEffect(() => {
        if (isPlaying) {
            const intervalTime = (60 / bpm) * 1000; // Convertir BPM a intervalo en milisegundos
            const interval = setInterval(() => {
                const nextTime = currentTime + 1;


                playChordsAtTime(nextTime);
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [isPlaying, currentTime, bpm, dispatch]);


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
        const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();

        new Tone.Part((time, value) => {
            polySynth.triggerAttackRelease(value.note, value.duration, time, value.pitch);
            console.log('Nota tocada en el tiempo:', time);
        }, toneJSNotes).start(0);

        Tone.Transport.bpm.value = 80;
        // Tone.Transport.start();
        audioModule.startSequence(toneJSNotes);

    };


    // Función para detener la reproducción
    const handleStop = () => {
        // Detiene el transporte de Tone.js y cancela eventos programados
        // Tone.Transport.cancel();

        // Tone.Transport.stop();
        // Tone.Transport.seconds = 0;
        audioModule.stopSequence();

    };



    function calcularDuracionToneJs(cuadritos) {
        // Asegúrate de que Tone.js esté importado o accesible en este contexto
        // Cada cuadrito es una semicorchea ("16n")
        if (cuadritos === 1) {
            return "16n"; // Un cuadrito es directamente una semicorchea
        } else if (cuadritos % 4 === 0) {
            // Si la cantidad de cuadritos es un múltiplo de 4, entonces es una corchea ("8n"), negra ("4n"), etc.
            const division = cuadritos / 4;
            if (division === 1) return "4n"; // Negra
            else if (division === 2) return "2n"; // Blanca
            else if (division === 4) return "1n"; // Redonda
            // Para duraciones más largas, ajusta según sea necesario
        } else {
            // Para duraciones que no encajan perfectamente en la notación estándar
            // Podemos devolver la duración como una combinación de notas y silencios, o manejar de otra manera
            // Por simplicidad, devolveremos la cantidad de "cuadritos" como "16n" concatenados, aunque esto no es ideal
            return Array(cuadritos).fill("16n").join(","); // Esto es una simplificación y puede no ser lo que deseas exactamente
        }

        // Caso por defecto, devuelve la cantidad de cuadritos como "16n" si no se cumple ninguna condición
        return Array(cuadritos).fill("16n").join(",");
    };

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

    return (
        <div>
            <div className="piano">
                {pianoNotes.map(({ note, type }) => (
                    <PianoKey key={note} note={note} type={type} />
                ))}
            </div>
            <div className={`note ${notes.isPlaying ? 'is-playing' : ''}`}>
                {/* Contenido de la nota */}
            </div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>

            <div className="pianoRoll">
                <Gridtest slots={slots}
                />
            </div>

            <div>
                <label htmlFor="bpm">BPM:</label>
                <input
                    type="number"
                    id="bpm"
                    value={bpm}
                    onChange={handleChangeBpm}
                />
            </div>
        </div>
    );
};
