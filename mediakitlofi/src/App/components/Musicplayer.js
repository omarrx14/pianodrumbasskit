import React, { useEffect } from 'react';
import { audioModule } from './AudioModule';

const MusicPlayer = () => {
    useEffect(() => {
        audioModule.startAudio();
    }, []);

    const handlePlayNote = () => {
        audioModule.playNote('C4');
    };

    const handleChangeInstrument = (instrumentType) => {
        audioModule.changeInstrument(instrumentType);
    };

    // Render buttons or UI elements to interact with the audio module
    return (
        <div>
            <button onClick={handlePlayNote}>Play C4</button>
            <button onClick={() => handleChangeInstrument('piano')}>Change to Piano</button>
            {/* Add more UI elements as needed */}
        </div>
    );
};

export default MusicPlayer;
