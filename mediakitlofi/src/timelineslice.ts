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
    time: number;
    bpm: number; // Añadir BPM al estado
    position: string; // Nueva propiedad para la posición en Bars:Beats:Sixteenths
    selectedCellsCount: []; // Nueva propiedad para almacenar el número de casillas seleccionadas
    notes: Note[];
    pianoRoll: {},
    slots: { [time: string]: TimeSlot };
    cells: {},
    selectedNote: Note | null; // Nueva propiedad para la nota seleccionada

}


const initialState: TimelineState = {
    chords: [],
    isPlaying: false,
    currentTime: 0,

    bpm: 120, // Valor inicial para BPM
    position: "0:0:0", // Iniciar en el comienzo
    notes: [],
    cells: {},
    slots: {},
    selectedNote: null,
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
            const { rowIndex, colIndex, note, pitch } = action.payload;

            const pitch1 = typeof pitch === 'string' || pitch instanceof String ? pitch : note.pitch;

            const noteId = `note-${Date.now()}`;

            // Calcular el compás (compass) y la corchea (en este caso, semicorchea) basado en 'colIndex'
            const compass = Math.floor(colIndex / 16);
            const corchea = colIndex % 16;

            // Calcular el endTime sumando la duración de la nota al startTime
            // Primero, calcula el total de semicorcheas desde el inicio de la pieza hasta el final de esta nota
            const totalSemicorcheas = colIndex + 4; // Asume 'cellDuration' es 4 para este ejemplo
            const endCompass = Math.floor(totalSemicorcheas / 16);
            const endCorchea = totalSemicorcheas % 16;


            const newNote = {
                id: noteId,
                pitch: pitch1,
                duration: calcularDuracionMusical(4), // Asume que 'cellDuration' es 4 para este ejemplo
                startTime: `${compass}:${Math.floor(corchea / 4)}:${corchea % 4}`,
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
        selectNote: (state, action) => {
            const { noteId } = action.payload;
            // Encuentra y marca la nota como seleccionada
            state.notes.forEach(note => {
                note.selected = note.id === noteId; // Usa `selected` en lugar de `selectedNote`
            });
            // Asume que `state.selectedNote` debe almacenar el ID de la nota seleccionada
            state.selectedNote = state.notes.find(note => note.id === noteId) || null;
        },

        deselectNote: (state) => {
            state.notes.forEach(note => {
                note.selected = false;
            });
            // Limpia el estado de la nota seleccionada
            state.selectedNote = null;
        },


        updateNotePosition: (state, action) => {
            const { noteId, newRowIndex, newColIndex, newPitch } = action.payload;
            const noteIndex = state.notes.findIndex(note => note.id === noteId);

            if (noteIndex !== -1) {
                const note = state.notes[noteIndex];

                // Actualiza la posición y el pitch de la nota
                note.rowIndex = newRowIndex;
                note.colIndex = newColIndex;
                note.pitch = newPitch; // Asumiendo que 'newPitch' viene incluido en la acción

                // Recalcular startTime y endTime basado en newColIndex
                const compass = Math.floor(newColIndex / 16);
                const corchea = newColIndex % 16;
                const totalSemicorcheas = newColIndex + note.cellDuration; // Asumiendo cellDuration es constante para este ejemplo
                const endCompass = Math.floor(totalSemicorcheas / 16);
                const endCorchea = totalSemicorcheas % 16;

                note.startTime = `${compass}:${Math.floor(corchea / 4)}:${corchea % 4}`;
                note.endTime = `${endCompass}:${Math.floor(endCorchea / 4)}:${endCorchea % 4}`;
                note.compass = compass;
                note.corchea = corchea;
            }
        },




        moveNote: (state, action) => {
            const { noteId, newRowIndex, newColIndex } = action.payload;
            const note = state.notes.find(note => note.id === noteId);
            if (note) {
                note.rowIndex = newRowIndex;
                note.colIndex = newColIndex;
                // Actualiza también compass y corchea si es necesario
                note.compass = calcularGrupo(newColIndex, 16) <= 0 ? 0 : (calcularGrupo(newColIndex, 16) - 1);
                note.corchea = getCorchea(newColIndex);
            }
        },

    },




},
);

export const { insertInMatrix, notes, selectNote, updateNotePosition } = timelineSlice.actions;
export default timelineSlice.reducer;
