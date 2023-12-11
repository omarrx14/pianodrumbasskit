import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Chord {
    name: string;
    notes: string[];
    position: number;
}

interface MatrixCell {
    chord: Chord | null;
}

interface TimelineState {
    chords: Chord[];
    isPlaying: boolean;
    currentTime: number;
    matrix: MatrixCell[]; // Matriz para representar los acordes en diferentes posiciones
    time: number;
}


const initialState: TimelineState = {
    chords: [],
    isPlaying: false,
    currentTime: 0,
    matrix: Array.from({ length: 12 }, () => Array(20).fill({ chord: null })),
};

const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        addChord: (state, action: PayloadAction<Chord>) => {
            state.chords.push(action.payload);
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        updateMatrix: (state, action: PayloadAction<{ chord: Chord; row: number; col: number }>) => {
            const { chord, row, col } = action.payload;
            if (row >= 0 && row < state.matrix.length && col >= 0 && col < state.matrix[0].length) {
                state.matrix[row][col] = { chord };
            }
        },
    },
});

export const { addChord, togglePlay, setCurrentTime, updateMatrix } = timelineSlice.actions;
export default timelineSlice.reducer;
