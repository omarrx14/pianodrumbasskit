import { createSlice, PayloadAction } from '@reduxjs/toolkit';

<<<<<<< Updated upstream
interface Chord {
    name: string;
    notes: string[];
    position: number;
}
=======
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
    note: string;
    units: number;
    velocity: number;
    pan: number;
    selected: boolean;
    name?: string; // Opcional, si notas tienen nombres
    row: number;
    column: number;
}

interface TimeSlot {
    notes: Note[];
    chords: Chord[]; // Asumimos que Chord se define en otra parte
}


>>>>>>> Stashed changes

interface MatrixCell {
    chord: Chord | null;
}

interface TimelineState {
    isPlaying: boolean;
    currentTime: number;
    matrix: MatrixCell[]; // Matriz para representar los acordes en diferentes posiciones
    time: number;
<<<<<<< Updated upstream
=======
    // bpm: number; // Añadir BPM al estado
    position: string; // Nueva propiedad para la posición en Bars:Beats:Sixteenths
    note: [];
    selectedCellsCount: []; // Nueva propiedad para almacenar el número de casillas seleccionadas
    notes: Note[];
    pianoRoll: {},
    slots: { [time: string]: TimeSlot };
    cells: {},
    selectedNote: Note | null; // Nueva propiedad para la nota seleccionada

>>>>>>> Stashed changes
}


const initialState: TimelineState = {
    chords: [],
    isPlaying: false,
    currentTime: 0,
<<<<<<< Updated upstream
    matrix: Array.from({ length: 12 }, () => Array(20).fill({ chord: null })),
=======
    matrix: Array.from({ length: 12 }, () => Array(20).fill([])),
    pianoRoll: {},
    bpm: 120, // Valor inicial para BPM
    position: "0:0:0", // Iniciar en el comienzo
    selectedCellsCount: 4, // Valor inicial, ajustable mediante un bar
    notes: [],
    cells: {},
    selectedNote: null, // Inicialmente, ninguna nota está seleccionada

    slots: {
        // Cada clave es una posición en el grid, y el valor es un array de notas en esa posición
        // "0:0": [{ id: "note1", pitch: "C4", duration: "4n", startTime: "0:0" }],
        // "1:2": [{ id: "note2", pitch: "E4", duration: "4n", startTime: "1:2" }],
        // Añade más notas según sea necesario
    },
>>>>>>> Stashed changes
};

const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
<<<<<<< Updated upstream
        addChord: (state, action: PayloadAction<Chord>) => {
            state.chords.push(action.payload);
        },
=======
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
        // insertInMatrix: (state, action) => {
        //     // console.log("action");
        //     const cellDuration = 4;

        //     const { rowIndex, colIndex, note } = action.payload;
        //     // Generar un ID único para la nota
        //     const noteId = `note-${Date.now()}`;

        //     const newNote = {
        //         id: noteId,
        //         pitch: note,
        //         duration: calcularDuracionMusical(cellDuration), // Duración inicial, ajustable posteriormente
        //         startTime: "0:0:0", // Ejemplo inicial, ajustable
        //         rowIndex,
        //         colIndex,
        //         selected: false,
        //         compass: calcularGrupo(colIndex, 16) <= 0 ? 0 : (calcularGrupo(colIndex, 16) - 1),
        //         corchea: getCorchea(colIndex),
        //         cellDuration
        //     };

        //     state.notes.push(newNote);
        // },
        insertInMatrix: (state, action) => {
            const { rowIndex, colIndex, note } = action.payload;

            // Generar un ID único para la nota
            const noteId = `note-${Date.now()}`;

            const compass = Math.floor(colIndex / 16); // Asume 16 semicorcheas por compás
            const corchea = colIndex % 16; // Obtiene la posición exacta dentro del compás

            const totalSemicorcheas = colIndex + 4; // Asume 'cellDuration' es 4 para este ejemplo
            const endCompass = Math.floor(totalSemicorcheas / 16);
            const endCorchea = totalSemicorcheas % 16;
            // Crear la nueva nota con la duración calculada y el tiempo de inicio basado en 'compass' y 'corchea'
            const newNote = {
                id: noteId,
                pitch: note,
                duration: calcularDuracionMusical(4), // Asume que 'cellDuration' es 4 para este ejemplo
                startTime: `${compass}:${Math.floor(corchea / 4)}:${corchea % 4}`, // Convierte 'corchea' a beat y subdivisión
                endTime: `${endCompass}:${Math.floor(endCorchea / 4)}:${endCorchea % 4}`, // Nuevo endTime calculado

                rowIndex,
                colIndex,
                selected: false,
                compass: compass,
                corchea: corchea,
                cellDuration: 4 // Asume una duración de celda fija para este ejemplo
            };

            state.notes.push(newNote);
        },


>>>>>>> Stashed changes
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },


        updateNotePosition: (state, action) => {
            const { noteId, newRowIndex, newColIndex } = action.payload;
            const noteIndex = state.notes.findIndex(note => note.id === noteId);

            if (noteIndex !== -1) {
                const note = state.notes[noteIndex];
                // Asegúrate de que `newRowIndex` está dentro del rango válido
                note.pitch = Object.values(NOTES)[newRowIndex % Object.keys(NOTES).length];

                // Calcular y actualizar startTime
                const bars = Math.floor(newColIndex / 16);
                const beats = Math.floor((newColIndex % 16) / 4);
                const sixteenths = newColIndex % 4;
                note.startTime = `${bars}:${beats}:${sixteenths}`;
            }
        },
<<<<<<< Updated upstream
    },
});

export const { addChord, togglePlay, setCurrentTime, updateMatrix } = timelineSlice.actions;
=======

        moveNote: (state, action) => {
            const { noteId, newRowIndex, newColIndex } = action.payload;
            const noteIndex = state.notes.findIndex(note => note.id === noteId);
            if (noteIndex !== -1) {
                state.notes[noteIndex].rowIndex = newRowIndex;
                state.notes[noteIndex].colIndex = newColIndex;
                // Aquí podrías agregar cualquier otra lógica necesaria, como actualizar el startTime basado en la nueva posición
            }
        },
        setSelectedCells: (state, action) => {
            state.notes = action.payload;
        },

        selectNote: (state, action) => {
            const { noteId } = action.payload;
            const note = state.notes.find(note => note.id === noteId);
            if (note) {
                state.selectedNote = note;
            }
        },
        deselectNote: (state) => {
            state.selectedNote = null;
        },
        setSelectedNote: (state, action) => {
            // action.payload debería ser el ID de la nota que quieres seleccionar
            // o podría ser directamente el objeto de la nota dependiendo de cómo
            // prefieras manejar la acción.
            const noteId = action.payload; // Si action.payload es el ID de la nota
            // Encuentra la nota por su ID
            const selectedNote = state.notes.find(note => note.id === noteId);
            // Actualiza el estado de selectedNote
            state.selectedNote = selectedNote || null;
        },
        // En tu timelineSlice

        addNote: (state, action) => {
            state.notes.push(action.payload);
        },
        updateNote: (state, action) => {
            const { noteId, newData } = action.payload;
            const noteIndex = state.notes.findIndex(note => note.id === noteId);
            if (noteIndex !== -1) {
                state.notes[noteIndex] = { ...state.notes[noteIndex], ...newData };
            }
        },
        deleteNote: (state, action) => {
            const noteId = action.payload;
            state.notes = state.notes.filter(note => note.id !== noteId);
        },
        toggleNoteSelection: (state, action: PayloadAction<Note>) => {
            const { rowIndex, colIndex } = action.payload;
            const noteIndex = state.notes.findIndex(note => note.rowIndex === rowIndex && note.colIndex === colIndex);
            if (noteIndex !== -1) {
                state.notes[noteIndex].selected = !state.notes[noteIndex].selected;
            }
        },

    },
});

export const { togglePlay, setCurrentTime, updateMatrix, setBpm, setPosition, insertInMatrix, notes,
    moveBlock,
    toggleCell,
    moveNote,
    selectNote, setSelectedNote,
    updateNotePosition, addNote, updateNote, deleteNote, toggleNoteSelection, setSelectedCells } = timelineSlice.actions;
>>>>>>> Stashed changes
export default timelineSlice.reducer;
