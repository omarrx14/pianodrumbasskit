import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function calcularGrupo(numero, limit) {
    return Math.floor((numero - 1) / limit) + 1;
}

function getCorchea(numero) {
    return numero % 16;
}


interface Chord {
    name: string;
    notes: string[];
    position: number;
}

interface MatrixCell {
    chord: Chord | null;
    note: string | null;
}

interface TimelineState {
    chords: Chord[];
    isPlaying: boolean;
    currentTime: number;
    matrix: MatrixCell[]; // Matriz para representar los acordes en diferentes posiciones
    time: number;
    bpm: number; // Añadir BPM al estado
    position: string; // Nueva propiedad para la posición en Bars:Beats:Sixteenths
    note: [];
    selectedCellsCount: number; // Nueva propiedad para almacenar el número de casillas seleccionadas
    bloqueSeleccionado: { rowIndex: number; colIndex: number } | null;

}


const initialState: TimelineState = {
    chords: [],
    isPlaying: false,
    currentTime: 0,
    matrix: Array.from({ length: 12 }, () => Array(20).fill([])),
    pianoRoll: {},
    bpm: 120, // Valor inicial para BPM
    position: "0:0:0", // Iniciar en el comienzo
    note: [],
    selectedCellsCount: 4, // Valor inicial, ajustable mediante un bar

};

function generarUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        insertInMatrix: (state, action) => {
            console.log("action");
            const { rowIndex, columnIndex, chord, note } = action.payload;

            // // Determina si la nota ya existe en alguna de las casillas seleccionadas
            // let noteExists = false;
            // for (let i = 0; i < 4; i++) { // Asumiendo que afectas 4 casillas
            //     const currentCell = state.matrix[rowIndex][columnIndex + i];
            //     if (currentCell && currentCell.note === note) {
            //         noteExists = true;
            //         break; // Si la nota existe en alguna casilla, no necesitamos buscar más
            //     }
            // }

            // // Alternar la nota en las casillas seleccionadas
            // for (let i = 0; i < 4; i++) { // Asumiendo que afectas 4 casillas
            //     const currentColIndex = columnIndex + i;
            //     if (currentColIndex < state.matrix[rowIndex].length) { // Verifica los límites de la matriz
            //         if (noteExists) {
            //             // Si la nota ya existe, la elimina
            //             state.matrix[rowIndex][currentColIndex] = { chord: null, note: null };
            //         } else {
            //             // Si la nota no existe, la agrega
            //             state.matrix[rowIndex][currentColIndex] = { chord, note };
            //         }
            //     }
            // }


            const noteKey = generarUUIDv4();
            // Actualiza el pianoRoll si es necesario

            state.pianoRoll[noteKey] = {
                note,
                compass: calcularGrupo(columnIndex, 16) <= 0 ? 0 : (calcularGrupo(columnIndex, 16) - 1),
                corchea: getCorchea(columnIndex),
                duration: 4
            };

            state.matrix[rowIndex][columnIndex].unshift(noteKey);
            state.matrix[rowIndex][columnIndex + 1].unshift(noteKey);
            state.matrix[rowIndex][columnIndex + 2].unshift(noteKey);
        },
        setSelectedCellsCount: (state, action: PayloadAction<number>) => {
            state.selectedCellsCount = action.payload;
        },

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
        moveBlock: (state, action: PayloadAction<{ rowIndex: number, colIndex: number, direction: string }>) => {
            const { rowIndex, colIndex, direction } = action.payload;
            // Calcula la nueva posición basada en la dirección
            let newRowIndex = rowIndex;
            let newColIndex = colIndex;

            switch (direction) {
                case 'arriba':
                    newRowIndex = Math.max(0, rowIndex - 1);
                    break;
                case 'abajo':
                    newRowIndex = Math.min(state.matrix.length - 1, rowIndex + 1);
                    break;
                case 'izquierda':
                    newColIndex = Math.max(0, colIndex - 4); // Asegura mover el bloque completo
                    break;
                case 'derecha':
                    newColIndex = Math.min(state.matrix[0].length - 4, colIndex + 4); // Asegura mover el bloque completo
                    break;
            }

            const temp = state.matrix[newRowIndex].slice(newColIndex, newColIndex + 4);
            state.matrix[rowIndex].splice(colIndex, 4, ...temp);
            state.matrix[newRowIndex].splice(newColIndex, 4, ...state.matrix[rowIndex].slice(colIndex, colIndex + 4));

        },

    },
});

export const { addChord, togglePlay, setCurrentTime, updateMatrix, setBpm, setPosition, insertInMatrix, note, setSelectedCellsCount, moveBlock } = timelineSlice.actions;
export default timelineSlice.reducer;
