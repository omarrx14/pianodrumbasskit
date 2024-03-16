// Timeline.tsx
import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
// import { notes } from '../Reducer/timelineslice.ts'; // Importa las acciones necesarias
import * as Tone from 'tone';
import './timeline.css';
import './pianokey1.css';
import './pianroll.css'; // Asegúrate de crear este archivo CSS para estilizar tu piano roll
import { Gridtest } from '../GridComponent/Gridtest.tsx';
import { audioModule } from '../../audiocontext/AudioModule.js'; // Asumiendo que este es el módulo de audio


import PianoKey from '../../../Pianokeys1.js';
import PianoVisual from '../PianoDesign1/PianoVisual.tsx';
import PianoVisual2 from '../PianoFigmaComponent/PianoDesign.jsx';
import Piano from '../PianoDesign1/PianoVisual.jsx';



export const Timeline: React.FC = () => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const dispatch = useDispatch();
    const { isPlaying, currentTime, matrix, notes } = useSelector((state) => state.timeline);
    const [bpm, setBpm] = useState(120); // Valor inicial de 120 BPM
    const { slots } = useSelector((state) => state.timeline);


    console.log('Matrix State:', notes); // Ver el estado actual de la matriz


    const pianoNotes = [
        { note: "C4", type: "white", velocity: ".05" }, { note: "C#4", type: "black" }, { note: "D4", type: "white" },
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
                duration: calcularDuracionMusical(note.cellDuration),
                velocity: .8, // Usar 'velocity' para la velocidad de la nota
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


    useEffect(() => {
        // Iniciar audio con tu módulo personalizado
        audioModule.startAudio();

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
        // const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();

        // Tone.Transport.start();
        audioModule.startSequence(toneJSNotes);
        console.log(audioModule);

    };


    // Función para detener la reproducción
    const handleStop = () => {
        // Detiene el transporte de Tone.js y cancela eventos programados
        // Tone.Transport.cancel();

        // Tone.Transport.stop();
        // Tone.Transport.seconds = 0;
        audioModule.stopSequence();

    };




    const calcularDuracionMusical = (duracionCeldas) => {
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
    console.log(calcularDuracionMusical(4)); // Debería devolver "4n"
    console.log(calcularDuracionMusical(8)); // Debería devolver "2n"
    console.log(calcularDuracionMusical(3)); // Devuelve "16n,16n,16n" como


    const handleChangeBpm = (e) => {
        const newBpm = Number(e.target.value);
        setBpmLocal(newBpm);
        dispatch(setBpmAction(newBpm)); // Actualiza el BPM en Redux
    };

    return (
        <div>
            {/* <div className="piano">
                {pianoNotes.map(({ note, type }) => (
                    <PianoKey key={note} note={note} type={type} />
                ))}
            </div> */}
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>

            <div className="pianoRoll">
                {/* <PianoVisual octaves={7} /> */}
                {/* <Piano /> */}
                <Gridtest />


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
