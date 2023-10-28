import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IMatrixState {
    matrix: Array<Array<number>>;
    currentStep: number;
    isPlaying: boolean;
    interval: number | null;
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

};

export const matrixSlice = createSlice({
    name: 'matrix',
    initialState,
    reducers: {
        nextColumn: (state) => {
            if (state.currentStep < state.matrix[0].length - 1) {
                state.currentStep += 1;
            } else {
                state.currentStep = 0;
            }
        },
        toggleStep: (state, action: PayloadAction<ICoordinates>) => {
            let newMatrix = state.matrix.map(inner => inner.slice());
            const { row, col } = action.payload;
            newMatrix[row][col] = 1 - newMatrix[row][col];
            state.matrix = newMatrix;
        },
        // Acción para cambiar el estado de reproducción
        playPause: (state) => {
            if (state.isPlaying) {
                // Si está reproduciendo, pausa y guarda el estado actual
                state.pausedStep = state.currentStep;
                state.isPlaying = false;
            } else {
                // Si está pausado, reanuda desde el estado guardado
                state.currentStep = state.pausedStep;
                state.isPlaying = true;
            }
        },
        // Acción para establecer el paso actual en la secuencia
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
    }
});

export const selectMatrix = (state: RootState) => state.matrix.matrix;
export const selectActiveColumn = (state: RootState) => state.matrix.currentStep;
export const selectisPlaying = (state: RootState) => state.matrix.isPlaying;
export const { nextColumn, toggleStep, playPause, setCurrentStep } = matrixSlice.actions;
export default matrixSlice.reducer;


