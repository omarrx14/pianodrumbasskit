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
    bpm: number; // Añadir BPM al estado
    position: string; // Nueva propiedad para la posición en Bars:Beats:Sixteenths
    notes: [];

}


const initialState: TimelineState = {
    chords: [],
    isPlaying: false,
    currentTime: 0,
    matrix: Array.from({ length: 12 }, () => Array(20).fill({ chord: null })),
    bpm: 120, // Valor inicial para BPM
    position: "0:0:0", // Iniciar en el comienzo

};

const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        setBpm: (state, action: PayloadAction<number>) => {
            state.bpm = action.payload;
            // Opcional: Actualizar Tone.Transport.bpm aquí si es adecuado para tu aplicación
        },
        setPosition: (state, action: PayloadAction<string>) => {
            state.position = action.payload;
            // Opcional: Actualizar Tone.Transport.position aquí
        },
        addChord: (state, action: PayloadAction<Chord>) => {
            state.chords.push(action.payload);
        },
        addNote: (state, action: PayloadAction<notes>) => {
            state.notes.push(action.payload);
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

export const { addChord, togglePlay, setCurrentTime, updateMatrix, setBpm, setPosition } = timelineSlice.actions;
export default timelineSlice.reducer;
