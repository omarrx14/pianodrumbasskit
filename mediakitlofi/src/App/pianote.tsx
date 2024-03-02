import React, { useContext, useState } from "react";
import { useDarkMode, useNotes } from './App/components/context.js'; // Asegúrate de importar correctamente tus hooks

import {
    LEFT_CLICK,
    NOTE_COLOR,
    NOTE_HEIGHT,
    PIANO_WIDTH,
} from "../Gridtest.tsx";


interface PianoNoteProps {
    note: string;
    playing: boolean;
}

export const PianoNote = ({ note, playing }: PianoNoteProps) => {
    const { notes } = useContext(NotesContext);
    const [playingNote, setPlayingNote] = useState<boolean>(false);
    const [mouseIn, setMouseIn] = useState<boolean>(false);
    const isC =
        note.at(0)?.toLowerCase() === "c" && note.at(1)?.toLowerCase() !== "#";

    const handlePlayNote = () => {
        if (!mouseIn) return;
        playNote(notes.instrument.player, note);
        setPlayingNote(true);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (!mouseIn) return setMouseIn(true);

        if (e.buttons == LEFT_CLICK) {
            playNote(notes.instrument.player, note);
            setPlayingNote(true);
        }
    };