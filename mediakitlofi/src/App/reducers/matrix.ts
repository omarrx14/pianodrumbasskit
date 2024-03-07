import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IMatrixState {
    matrix: Array<Array<number>>;
    currentStep: number;
    isPlaying: boolean;
    interval: any;
    pausedStep: 0,


}

export interface ICoordinates {
    row: number;
    col: number;
}

const initialState: IMatrixState = {
    matrix: Array.from(Array(6), () => Array(12).fill(0)),
    currentStep: 0,
    isPlaying: false,
    interval: null,
    pausedStep: 0,
<<<<<<< Updated upstream
    bpm: 190 // Un valor predeterminado
=======
    // bpm: 120 // Un valor predeterminado
>>>>>>> Stashed changes

};

export const matrixSlice = createSlice({
    name: 'matrix',
    initialState,
    reducers: {
        // setBPM: (state, action: PayloadAction<number>) => {
        //     state.bpm = action.payload;
        // },

        nextColumn: (state) => {
            if (state.currentStep < state.matrix[0].length - 1) {
                state.currentStep += 1;
            } else {
                state.currentStep = 0;
            }
        },
        toggleStep: (state, action: PayloadAction<ICoordinates>) => {
            const { row, col } = action.payload;
            state.matrix[row][col] = 1 - state.matrix[row][col];
        },
        clear: (state, action: PayloadAction<ICoordinates>) => {
            state.matrix = Array.from(Array(6), () => Array(12).fill(0));
            state.currentStep = 0
        },
        // Acción para cambiar el estado de reproducción
<<<<<<< Updated upstream
        play: (state, action: PayloadAction) => {
            // Si está pausado, reanuda desde el estado guardado
            state.currentStep = state.pausedStep;
            state.isPlaying = true;
            state.interval = action.payload;

        },
        pause: (state, action: PayloadAction) => {
            if (state.isPlaying) {
                // Si está reproduciendo, pausa y guarda el estado actual
                state.pausedStep = state.currentStep;
                state.isPlaying = false;
                state.interval = null;
            }
        },
=======
        // playPause: (state, action: PayloadAction) => {
        //     if (state.isPlaying) {
        //         // Si está reproduciendo, pausa y guarda el estado actual
        //         state.pausedStep = state.currentStep;
        //         state.isPlaying = false;
        //         state.interval = null;

        //     } else {
        //         // Si está pausado, reanuda desde el estado guardado
        //         state.currentStep = state.pausedStep;
        //         state.isPlaying = true;
        //         state.interval = 111;

        //     }
        // },
>>>>>>> Stashed changes
        // Acción para establecer el paso actual en la secuencia
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;

        },
    }
});

export const selectMatrix = (state: RootState) => state.matrix.matrix;
export const selectActiveColumn = (state: RootState) => state.matrix.currentStep;
// export const selectisPlaying = (state: RootState) => state.matrix.isPlaying;
// export const selectBPM = (state: RootState) => state.matrix.bpm;

export const { nextColumn, toggleStep, play, pause, setCurrentStep, setBPM } = matrixSlice.actions;
export default matrixSlice.reducer;


