import { createSlice } from '@reduxjs/toolkit';
import { drumSounds, steps } from './actions';

const initialState = {
    sequence: drumSounds.map(() => Array(steps).fill(false)),
    isPlaying: false,
    currentStep: 0,
    pausedStep: 0,


};



const drumMachineSlice = createSlice({
    name: 'drumMachine',
    initialState,
    reducers: {
        // Acción para cambiar el estado de un paso específico en la secuencia
        toggleStep: (state, action) => {
            const { row, col } = action.payload;
            if (row >= 0 && row < state.sequence.length && col >= 0 && col < state.sequence[0].length) {
                state.sequence[row][col] = !state.sequence[row][col];
            } else {
                console.error('Índices fuera de rango', row, col);
            }
        },
        // Acción para cambiar el estado de reproducción
        playPause: (state, action) => {
            if (state.isPlaying) {
                state.pausedStep = state.currentStep;
            } else {
                state.currentStep = state.pausedStep;
            }
            state.isPlaying = !state.isPlaying;
        },
        // Acción para establecer el paso actual en la secuencia
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
    },
});

// Exporta las acciones para que puedan ser utilizadas en otros archivos
export const { toggleStep, playPause, setCurrentStep, currentStep } = drumMachineSlice.actions;

// Exporta el reducer para ser utilizado en la configuración de la store
export default drumMachineSlice.reducer;
