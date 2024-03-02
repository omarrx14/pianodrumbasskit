import React, { useRef, useEffect, useState, useContext } from 'react';
import './gridtest.css';
import { useDispatch, useSelector } from 'react-redux';
import { insertInMatrix } from './timelineslice.ts';
import { useDarkMode, useNotes } from './App/components/context.js'; // Asegúrate de importar correctamente tus hooks
import { audioModule } from './App/audiocontext/AudioModule.js'; // Asumiendo que este es el módulo de audio
import { NoteData } from "./note.ts";

interface GridProps {
    handleMouseDownOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMoveOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}



export const Gridtest = ({ handleMouseDownOnGrid,
    handleMouseMoveOnGrid, slots
}: GridProps): JSX.Element => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const numberOfRows = 12;
    const numberOfColumns = 20;
    const cellSize = 25; // Tamaño de cada celda en píxeles
    const headerSize = 30;
    const NOTE_WIDTH = 10; // Tamaño de la nota en píxeles (ancho)
    const NOTE_HEIGHT = 20; // Tamaño de la nota en píxeles (alto)
    const SELECTED_NOTE_COLOR = '#f00'; // Color para la nota seleccionada
    const NOTE_COLOR = '#000'; // Color para las notas no seleccionadas
    const { isPlaying, currentTime, matrix, pianoRoll } = useSelector((state) => state.timeline);
    const [isDragging, setIsDragging] = useState(false);

    // Asumiendo que la fila más alta (0) corresponde a C2 (MIDI number 36)
    const calculatePitchFromRowIndex = (rowIndex, lowestNote = 36) => {
        return lowestNote + rowIndex;
    };

    // Estado para rastrear las celdas seleccionadas
    const [selectedCells, setSelectedCells] = useState([]);
    const { darkMode, setDarkMode } = useDarkMode();
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const { notes1, setNotes1 } = useNotes();
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );



    const drawGrid = (ctx) => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        for (let row = 0; row < numberOfRows; row++) {
            for (let col = 0; col < numberOfColumns; col++) {
                ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    };

    // Función para dibujar una celda seleccionada
    const drawSelectedCell = (ctx, rowIndex, colIndex) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
    };

    // Modificar 'handleCanvasClick' para incluir selección/deselección de notas
    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const colIndex = Math.floor(x / cellSize);
        const rowIndex = Math.floor(y / cellSize);

        const notePitch = calculatePitchFromRowIndex(rowIndex);

        const clickedNote = notes.find(note => note.rowIndex === rowIndex && note.colIndex === colIndex);

        if (clickedNote) {
            setSelectedNote(clickedNote);
        } else {
            const newNote = {
                id: `note-${Date.now()}`,
                rowIndex,
                colIndex,
                pitch: notePitch,
                duration: "4n",
                selected: true,
            };
            setNotes(prevNotes => [...prevNotes, newNote]);
            // dispatch(insertInMatrix({ note: notePitch }));

        }
        const moveNote = (newRowIndex, newColIndex) => {
            if (!selectedNote) return;
            const updatedNotes = notes.map((note) => {
                if (note === selectedNote) {
                    return { ...note, rowIndex: newRowIndex, colIndex: newColIndex };
                }
                return note;
            });
            setNotes(updatedNotes);
        };
        const changeNoteDuration = (newDuration) => {
            if (!selectedNote) return;
            const updatedNotes = notes.map((note) => {
                if (note === selectedNote) {
                    return { ...note, duration: newDuration };
                }
                return note;
            });
            setNotes(updatedNotes);
        };

        const addNoteToGrid = (note) => {
            setNotes((prevNotes) => [...prevNotes, note]);
        };

        // Función para manejar la selección de notas en el canvas
        const handleNoteSelection = (rowIndex, colIndex) => {
            // Verifica si la nota ya está seleccionada
            const noteIndex = notes.findIndex(note => note.rowIndex === rowIndex && note.colIndex === colIndex);
            if (noteIndex !== -1) {
                // Cambia el estado de selección de la nota
                const updatedNotes = notes.map((note, index) => {
                    if (index === noteIndex) {
                        return { ...note, selected: !note.selected };
                    }
                    return note;
                });
                setNotes(updatedNotes);
            }

        };
        clickOnCanvas(rowIndex, colIndex);
        handleNoteSelection(rowIndex, colIndex);
        changeNoteDuration(rowIndex, colIndex);
        moveNote(rowIndex, colIndex);
        // if (selectedNote) {
        //     // Considera que 'notePitch' podría ser derivado de 'selectedNote.pitch' u otra lógica
        //     audioModule.playNote(selectedNote.pitch, '4n'); // '4n' es la duración, ajusta según sea necesario
        // }

    };


    const clickOnCanvas = (rowIndex, colIndex) => {
        // Aquíconst clickOnCanvas = (rowIndex, colIndex) => {
        const octavaC4aB4 = {
            0: "C4",
            1: "C#4 / Db4",
            2: "D4",
            3: "D#4 / Eb4",
            4: "E4",
            5: "F4",
            6: "F#4 / Gb4",
            7: "G4",
            8: "G#4 / Ab4",
            9: "A4",
            10: "A#4 / Bb4",
            11: "B4"
        };
        const note = octavaC4aB4[rowIndex % 12]; // Asegura que rowIndex siempre esté dentro del rango

        // Para este ejemplo, simplemente agregamos la celda al estado de seleccionadas
        setSelectedCells(prev => [...prev, { rowIndex, colIndex, note }]);

        // Aquí deberías también despachar tu acción como antes
        dispatch(insertInMatrix({ rowIndex, colIndex, note }));


    };


    const drawNote = (ctx, note: NoteData, ghost = false) => {
        const x = note.column * NOTE_WIDTH;
        const y = (notes.length - 1 - note.row) * NOTE_HEIGHT;
        const width = NOTE_WIDTH * note.units; // 'units' determina cuántas celdas ocupa la nota
        const height = NOTE_HEIGHT;

        const noteColor = ghost ? `rgba(0, 0, 0, 0.5)` : NOTE_COLOR;
        const selectedNoteColor = ghost ? `rgba(255, 0, 0, 0.1)` : SELECTED_NOTE_COLOR;

        ctx.fillStyle = note.selected ? selectedNoteColor : noteColor;
        ctx.fillRect(x, y, width, height);

        // Opcional: Agregar texto a la nota
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(note.name, x + 5, y + NOTE_HEIGHT / 2);

        const ellipsized = (notes: string, maxLength: number) => {
            if (maxLength < 0) return ''
            if (notes.length > maxLength) {
                return notes.slice(0, maxLength) + "..";
            }
            return notes;
        }
        let maxLength = 3;
        switch (note.units) {
            case 1:
                maxLength = -1;
                break;
            case 2:
                maxLength = 0;
                break;
            case 3:
                maxLength = 1;
        }
        // notes1.fillText(ellipsized(note.note, maxLength), x + 2, y + 21);
    };


    // Función para mover la nota seleccionada
    const moveSelectedNote = (newRowIndex, newColIndex) => {
        const updatedNotes = notes.map((note) => {
            if (note.selected) {
                return {
                    ...note,
                    rowIndex: newRowIndex,
                    colIndex: newColIndex
                };
            }
            return note;
        });
        setNotes(updatedNotes);
    };

    // Función para cambiar la duración de la nota seleccionada
    const changeSelectedNoteDuration = (newDuration) => {
        const updatedNotes = notes.map((note) => {
            if (note.selected) {
                return {
                    ...note,
                    duration: newDuration
                };
            }
            return note;
        });
        setNotes(updatedNotes);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        drawGrid(ctx);
        drawNotes(ctx); // Dibuja las notas en el grid
        // Dibuja las celdas seleccionadas
        selectedCells.forEach(cell => drawSelectedCell(ctx, cell.rowIndex, cell.colIndex));
        setContext(ctx);


    }, [selectedCells, darkMode, notes]); // Añadir 'notes' como dependencia


    // const handleNotePlayback = (note) => {
    //     audioModule.playNote(note.pitch, note.duration);
    // };

    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d');
    //     drawGrid(ctx);
    //     // Dibuja las celdas seleccionadas
    //     selectedCells.forEach(cell => drawSelectedCell(ctx, cell.rowIndex, cell.colIndex));
    // }, [selectedCells, darkMode]); // Dependencias del efecto



    // Función para agregar una nota al grid


    // Función para dibujar notas en el canvas
    const drawNotes = (ctx) => {
        notes.forEach((note) => drawNote(ctx, note));
    };





    // useEffect(() => {
    //     audioModule.startAudio();
    // }, []);



    return (
        <div className="grid-canvas-container" style={{
            // backgroundImage: `url("${process.env.PUBLIC_URL}/assets/grid-${darkMode ? "02" : "01"}.svg")`,
            backgroundColor: darkMode ? "#333" : "#fff",

            backgroundSize: 'cover', // Esto hará que la imagen de fondo cubra completamente el div
        }}>
            <canvas
                ref={canvasRef}
                width={numberOfColumns * cellSize}
                height={numberOfRows * cellSize}
                onClick={handleCanvasClick}
                className="grid-canvas"
                onMouseDown={handleMouseDownOnGrid}
                onMouseMove={handleMouseMoveOnGrid}
            />
            <button onClick={() => {
                console.log("Toggling dark mode from", darkMode, "to", !darkMode);
                setDarkMode(!darkMode);
            }}>
                Toggle Dark Mode
            </button>

        </div>
    );
};
