// usePianoRoll.js
import { useCallback } from 'react';
import { useNotes, NOTE_WIDTH, PIANO_WIDTH, snapValue } from './App/components//context.js'; // Asegúrate de tener estas constantes definidas

export const usePianoRoll = () => {
    const { notes, setNotes } = useNotes();
    const { snapValue } = useContext(SnapValueContext);

    const handleMoveNote = useCallback((e, noteId) => {
        // Aquí vendría la lógica para manejar el movimiento de una nota específica.
        // Por simplicidad, esto es solo un esqueleto del método.
    }, [notes, setNotes]);

    const handleChangeNotePosition = useCallback((noteId, newPosition) => {
        const updatedNotes = notes.map(note => {
            if (note.id === noteId) {
                return { ...note, ...newPosition };
            }
            return note;
        });
        setNotes(updatedNotes);
    }, [notes, setNotes]);

    return {
        handleMoveNote,
        handleChangeNotePosition,
    };
};
