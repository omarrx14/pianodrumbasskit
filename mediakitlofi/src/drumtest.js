

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Tone from 'tone';
import DrumPad2 from './drumpd';
import './drumcss.css';
// import { setCurrentStep } from './App/reducers/reducer';
import { drumSounds } from './App/reducers/actions'; // Importa drumSounds
import Square from './App/reducers/Square.tsx';
import { selectMatrix, playPause, toggleStep, setCurrentStep } from './App/reducers/matrix.ts';


export const DrumMachine = () => {
    const dispatch = useDispatch();
    const nextColumn = useSelector(state => state.matrix.nextColumn);
    const isPlaying = useSelector(state => state.matrix.isPlaying);
    const currentStep = useSelector(state => state.matrix.currentStep);
    const matrix = useSelector(selectMatrix);

    useEffect(() => {
        const loop = new Tone.Sequence(
            (time, step) => {
                matrix.forEach((row, index) => {
                    if (row[step] === 1) {
                        playSound(drumSounds[index].note, drumSounds[index].type, time);
                    }
                });
                dispatch(setCurrentStep(step));
            },
            [...Array(matrix[0].length).keys()],
            '8n'
        );
        loop.start(0);

        return () => {
            loop.dispose();
            Tone.Transport.stop();
        };
    }, [matrix, dispatch, setCurrentStep]);

    useEffect(() => {
        if (isPlaying) {
            Tone.Transport.start();

        } else {
            Tone.Transport.stop();
        }
    }, [isPlaying]);

    const playSound = async (note, type) => {
        await Tone.start();
        let synth;
        switch (type) {
            case 'MembraneSynth':
                synth = new Tone.MembraneSynth().toDestination();
                synth.triggerAttackRelease(note, "8n");
                break;
            case 'NoiseSynth':
                synth = new Tone.NoiseSynth({
                    noise: {
                        type: 'white'
                    },
                    envelope: {
                        attack: 0.005,
                        decay: 0.1,
                        sustain: 0
                    }
                }).toDestination();
                synth.triggerAttackRelease(note);
                break;
            case 'MetalSynth':
                synth = new Tone.MetalSynth().toDestination();
                synth.triggerAttackRelease(note, "8n");
                break;
            default:
                synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease(note, "8n");
                break;
        }
    };


    const handleStepClick = (rowIndex, colIndex) => {
        console.log('toggleStep', rowIndex, colIndex);
        dispatch(toggleStep({ row: rowIndex, col: colIndex }));
    };


    const testSound = () => {
        playSound('C1', 'MembraneSynth');
        setTimeout(() => playSound('16n', 'NoiseSynth'), 500);
        setTimeout(() => playSound('D1', 'MembraneSynth'), 1000);
        setTimeout(() => playSound('F1', 'MembraneSynth'), 1500);
        setTimeout(() => playSound('A1', 'MetalSynth'), 2000);
    };

    return (
        <div className="drum-container">
            <div className='Grid'>
                <div className="drum-machine">
                    <div className="sequencer">
                        {matrix.map((row, rowIndex) => (
                            <div key={rowIndex} className="Row">
                                {row.map((isActive, colIndex) => (
                                    <Square
                                        key={colIndex}
                                        active={isActive}
                                        toggled={currentStep === colIndex}
                                        onClick={() => handleStepClick(rowIndex, colIndex)}
                                    />

                                ))}
                            </div>


                        ))}

                    </div>
                </div>

                <button onClick={() => dispatch(playPause())}>
                    {isPlaying ? 'Stop' : 'Start'}
                </button>
                <button onClick={testSound}>Probar Sonido</button> {/* Botón para probar el sonido */}
            </div>
            <div className="drum-pad-container">
                {drumSounds.map((drum, index) => (
                    <DrumPad2
                        key={index}
                        note={drum.note}
                        playSound={() => playSound(drum.note, drum.type)}
                        label={drum.label}
                    />
                ))}
            </div>
        </div>
    );
};

export default DrumMachine;
