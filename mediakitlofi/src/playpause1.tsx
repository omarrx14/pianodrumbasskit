import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './App/store'; // Asegúrate de importar correctamente RootState desde tu store
import { play, pause, selectCurrentlyPlaying } from '../matrix'; // Asegúrate de importar correctamente las acciones y selectores

export const PlayPause = () => {
    const isPlaying = useSelector((state: RootState) => selectCurrentlyPlaying(state));
    const dispatch = useDispatch();

    const handlePlayback = () => {
        if (isPlaying) {
            dispatch(pause());
        } else {
            dispatch(play());
        }
    };

    return (
        <div className='playpause'>
            <input type="checkbox" id="playpause" name="check" checked={isPlaying} readOnly />
            <label htmlFor="playpause" tabIndex={1} onClick={handlePlayback}></label>
        </div>
    );
}

export default PlayPause;
