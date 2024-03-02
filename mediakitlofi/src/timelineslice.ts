import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function calcularGrupo(numero, limit) {
    return Math.floor((numero - 1) / limit) + 1;
}
const slots = {
    // "0:0": [{ id: "note1", pitch: "C4", duration: "4n", startTime: "0:0" }],
    // "1:2": [{ id: "note2", pitch: "E4", duration: "4n", startTime: "1:2" }],
    // Añade más notas según sea necesario
}

function getCorchea(numero) {
    return numero % 16;
}



interface Note {
    id: string;
    pitch: string; // Por ejemplo, "C4"
    duration: string; // Por ejemplo, "4n"
    startTime: string; // Formato "Bars:Beats:Sixteenths", por ejemplo, "1:2:0"
}

interface TimeSlot {
    notes: Note[];
    chords: Chord[]; // Asumimos que Chord se define en otra parte
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
    matrix: MatrixCell[][]; // Matriz para representar los acordes en diferentes posiciones
    time: number;
    bpm: number; // Añadir BPM al estado
    position: string; // Nueva propiedad para la posición en Bars:Beats:Sixteenths
    note: [];
    selectedCellsCount: []; // Nueva propiedad para almacenar el número de casillas seleccionadas
    notes: Note[];
    pianoRoll: {},
    slots: { [time: string]: TimeSlot };
    cells: {},

}


const initialState: TimelineState = {
    chords: [],
    isPlaying: false,
    currentTime: 0,
    matrix: Array.from({ length: 12 }, () => Array(20).fill([])),
    pianoRoll: {},
    bpm: 120, // Valor inicial para BPM
    position: "0:0:0", // Iniciar en el comienzo
    selectedCellsCount: 4, // Valor inicial, ajustable mediante un bar
    notes: [],
    cells: {},

    slots: {
        // Cada clave es una posición en el grid, y el valor es un array de notas en esa posición
        // "0:0": [{ id: "note1", pitch: "C4", duration: "4n", startTime: "0:0" }],
        // "1:2": [{ id: "note2", pitch: "E4", duration: "4n", startTime: "1:2" }],
        // Añade más notas según sea necesario
    },
};

function generarUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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

const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        // insertInMatrix: (state, action) => {
        //     console.log("action");
        //     const { rowIndex, columnIndex, chord, note } = action.payload;


        //     const noteKey = generarUUIDv4();

        //     // Actualiza el pianoRoll si es necesario

        //     state.pianoRoll[noteKey] = {
        //         note,
        //         compass: calcularGrupo(columnIndex, 16) <= 0 ? 0 : (calcularGrupo(columnIndex, 16) - 1),
        //         corchea: getCorchea(columnIndex),
        //         duration: 1
        //     };

        //     // state.matrix[rowIndex][columnIndex].unshift(noteKey);

        // },

        // Ejemplo de acción para agregar una nota
        insertInMatrix: (state, action) => {
            console.log("action");

            const { rowIndex, colIndex, note } = action.payload;
            // Generar un ID único para la nota
            const noteId = `note-${Date.now()}`;
            const newNote = {
                id: noteId,
                pitch: note,
                duration: "4n", // Duración inicial, ajustable posteriormente
                startTime: "0:0:0", // Ejemplo inicial, ajustable
                rowIndex,
                colIndex,
                selected: false,
                compass: calcularGrupo(colIndex, 16) <= 0 ? 0 : (calcularGrupo(colIndex, 16) - 1),
                corchea: getCorchea(colIndex),
            };

            state.notes.push(newNote);
        },


        // toggleCell: (state, action) => {
        //     console.log("action");

        //     const { position, columnIndex, rowIndex, note } = action.payload; // `position` es "rowIndex:colIndex"
        //     const noteKey = generarUUIDv4();

        //     // Actualiza el pianoRoll si es necesario

        //     state.pianoRoll[noteKey] = {
        //         note,
        //         compass: calcularGrupo(columnIndex, 16) <= 0 ? 0 : (calcularGrupo(columnIndex, 16) - 1),
        //         corchea: getCorchea(columnIndex),
        //         duration: 1
        //     };
        //     if (state.pianoRoll[position]) {
        //         delete state.pianoRoll[position]; // Desmarcar si ya está marcada
        //     } else {
        //         state.pianoRoll[position] = true; // O asigna un objeto de nota aquí
        //     }
        //     state.matrix[rowIndex][columnIndex].unshift(noteKey);

        // },
        toggleCell: (state, action) => {
            const { columnIndex, rowIndex, note } = action.payload;
            const position = `${rowIndex}:${columnIndex}`; // Asegúrate de que esto es lo que quieres
            const noteKey = generarUUIDv4();
            console.log("action");

            // Decide si usar position o noteKey como clave principal en pianoRoll
            // Aquí usamos noteKey para detalles de la nota y position para marcar/desmarcar
            state.pianoRoll[noteKey] = {
                note,
                compass: calcularGrupo(columnIndex, 16) <= 0 ? 0 : calcularGrupo(columnIndex, 16) - 1,
                corchea: getCorchea(columnIndex),
                duration: 1,
                slots: {},
            };

            // Si quieres marcar/desmarcar, considera tener un estado separado o ajustar tu lógica aquí
            // Por ejemplo, si cells es un array de arrays y quieres marcar la celda con noteKey
            if (!state.cells[rowIndex]) {
                state.cells[rowIndex] = [];
            }
            if (!state.cells[rowIndex][columnIndex]) {
                state.cells[rowIndex][columnIndex] = [];
            }
            state.cells[rowIndex][columnIndex] = [noteKey, ...state.cells[rowIndex][columnIndex]];

        },
        toggleNoteSelection: (state, action: PayloadAction<string>) => {
            // Suponiendo que `action.payload` es el ID de una nota
            const noteId = action.payload;
            const noteIndex = state.notes.findIndex(note => note.id === noteId);
            if (noteIndex > -1) {
                state.notes[noteIndex].selected = !state.notes[noteIndex].selected;
            }
        },

        addNote: (state, action: PayloadAction<Note>) => {
            state.notes.push(action.payload);
        },
        updateNote: (state, action: PayloadAction<Note>) => {
            const index = state.notes.findIndex(note => note.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        removeNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter(note => note.id !== action.payload);
        },


        // addNote: (state, action: PayloadAction<Note>) => {
        //     const note = action.payload;
        //     const startTime = note.startTime;
        //     if (!state.slots[startTime]) {
        //         state.slots[startTime] = { notes: [], chords: [] };
        //     }
        //     state.matrix[startTime].notes.unshift(note);
        // },



        setZoomLevel: (state, action: PayloadAction<number>) => {
            state.zoomLevel = action.payload;
        },

        alargarNota: (state, action: PayloadAction<{ rowIndex: number, colIndex: number, nuevaDuracion: number }>) => {
            const { rowIndex, colIndex, nuevaDuracion } = action.payload;
            // Asegúrate de que rowIndex está dentro de los límites de la matriz
            if (rowIndex < 0 || rowIndex >= state.matrix.length) {
                console.error('Índice de fila fuera de rango:', rowIndex);
                return;
            }

            const noteKey = state.matrix[rowIndex][colIndex]?.[0]; // Usa el operador opcional para evitar errores si la celda es undefined
            if (!noteKey) {
                console.error('No se encontró noteKey en la posición dada:', rowIndex, colIndex);
                return;
            }

            // Itera sobre las celdas afectadas por la nueva duración
            for (let i = 0; i < state.matrix[rowIndex].length; i++) {
                if (colIndex + i < state.matrix[rowIndex].length) { // Verifica que colIndex + i esté dentro de los límites
                    const cell = state.matrix[rowIndex][colIndex + i];
                    if (i < nuevaDuracion) {
                        // Asegura que la celda esté marcada como parte de la nota
                        if (!cell.includes(noteKey)) {
                            cell.push(noteKey);
                        }
                    } else {
                        // "Limpia" las celdas que ya no forman parte de la nota
                        const index = cell.indexOf(noteKey);
                        if (index > -1) {
                            cell.splice(index, 1);
                        }
                    }
                }
            }
        },


        actualizarDuracionNota: (state, action) => {
            const { noteKey, inicio, fin } = action.payload;
            // Calcula la duración basada en la selección
            const duracion = Math.abs(fin.colIndex - inicio.colIndex) + 1; // +1 para incluir ambas celdas de inicio y fin

            // Actualiza el estado para todas las celdas seleccionadas
            for (let i = inicio.colIndex; i <= inicio.colIndex + duracion - 1; i++) {
                if (i < state.matrix[inicio.rowIndex].length) {
                    state.matrix[inicio.rowIndex][i].unshift(noteKey);
                    // Aquí también deberías actualizar la duración de la nota en pianoRoll o cualquier otra parte relevante del estado
                }
            }
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

export const { addChord, togglePlay, setCurrentTime, updateMatrix, setBpm, setPosition, insertInMatrix, notes, moveBlock, toggleCell, addNote, updateNote, removeNote } = timelineSlice.actions;
export default timelineSlice.reducer;
