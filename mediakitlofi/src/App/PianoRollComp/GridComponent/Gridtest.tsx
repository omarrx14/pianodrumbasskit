


import React, { useRef, useEffect, useState, useContext } from 'react';
import './gridtest.css';
import { ReactReduxContext, useDispatch, useSelector } from 'react-redux';
import { insertInMatrix, moveNote, selectNote, setSelectedNote, toggleNoteSelection, updateNotePosition, setSelectedCells } from '../Reducer/timelineslice.ts';
import { useDarkMode, useNotes } from '../../components/context.js'; // Asegúrate de importar correctamente tus hooks
import { audioModule } from '../../audiocontext/AudioModule.js'; // Asumiendo que este es el módulo de audio
import { NoteData } from "../../../note.ts";
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import Piano from '../PianoDesign1/PianoVisual.jsx';


interface GridProps {
    handleMouseDownOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMoveOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}



const Gridtest1 = ({ slots }: GridProps): JSX.Element => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const numberOfRows = 88;
    const numberOfColumns = 20;
    const cellSize = 25; // Tamaño de cada celda en píxeles
    const rowSize = 25;
    const headerSize = 30;
    const NOTE_WIDTH = 25; // Tamaño de la nota en píxeles (ancho)
    const NOTE_HEIGHT = 25; // Tamaño de la nota en píxeles (alto)
    const SELECTED_NOTE_COLOR = '#88178F'; // Color para la nota seleccionada
    const NOTE_COLOR = '#276C9E'; // Color para las notas no seleccionadas
    const pianoWidth = 0; // Ancho aproximado para las teclas del piano
    const gridWidth = numberOfColumns * cellSize; // Ancho total del grid
    const totalWidth = pianoWidth + gridWidth; // Ancho total necesario para el canvas

    const totalHeight = numberOfRows * cellSize; // Altura total basada en el número de filas

    // Asumiendo que la fila más alta (0) corresponde a C2 (MIDI number 36)
    // const calculatePitchFromRowIndex = (rowIndex, lowestNote = 60) => {
    //     return lowestNote + rowIndex;
    // };
    const calculatePitchFromRowIndex = (rowIndex) => {
        const noteNames = [
            "C0", "C#0 / Db0", "D0", "D#0 / Eb0", "E0", "F0", "F#0 / Gb0", "G0", "G#0 / Ab0", "A0", "A#0 / Bb0", "B0",
            "C1", "C#1 / Db1", "D1", "D#1 / Eb1", "E1", "F1", "F#1 / Gb1", "G1", "G#1 / Ab1", "A1", "A#1 / Bb1", "B1",
            "C2", "C#2 / Db2", "D2", "D#2 / Eb2", "E2", "F2", "F#2 / Gb2", "G2", "G#2 / Ab2", "A2", "A#2 / Bb2", "B2",
            "C3", "C#3 / Db3", "D3", "D#3 / Eb3", "E3", "F3", "F#3 / Gb3", "G3", "G#3 / Ab3", "A3", "A#3 / Bb3", "B3",
            "C4", "C#4 / Db4", "D4", "D#4 / Eb4", "E4", "F4", "F#4 / Gb4", "G4", "G#4 / Ab4", "A4", "A#4 / Bb4", "B4",
            "C5", "C#5 / Db5", "D5", "D#5 / Eb5", "E5", "F5", "F#5 / Gb5", "G6", "G#6 / Ab5", "A5", "A#5 / Bb5", "B5",
            "C6", "C#6 / Db6", "D6", "D#6 / Eb6", "E6", "F6", "F#6 / Gb6", "G7", "G#7 / Ab6", "A6", "A#6 / Bb6", "B6",
            "C7", "C#7 / Db7", "D7", "D#7 / Eb7", "E7", "F7", "F#7 / Gb7", "G8", "G#8 / Ab7", "A7", "A#7 / Bb7", "B7",


        ];

        if (rowIndex < 0 || rowIndex > 88) {
            console.error("rowIndex fuera de rango");
            return ""; // 
        }

        return noteNames[rowIndex];
    };

    const { darkMode, setDarkMode } = useDarkMode();

    const { selectedNote } = useSelector((state) => state.timeline);
    // const notes = useSelector((state) => state.timeline.notes);
    const { notes } = useSelector(state => state.timeline);
    const selectedCells = useSelector((state) => state.timeline.notes);
    const [isDragging, setIsDragging] = useState(false);
    // const initialPositionRef = useRef({ rowIndex: null, colIndex: null });


    const calculateNotePosition = (event) => {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - canvasRect.left - pianoWidth; // Resta pianoWidth aquí
        const y = event.clientY - canvasRect.top;
        // Asegúrate de que x no sea negativo antes de calcular colIndex
        const colIndex = x > 0 ? Math.floor(x / cellSize) : null;
        const rowIndex = Math.floor(y / cellSize);

        return { rowIndex, colIndex };
    };
    const tempNotePosition = useRef({ rowIndex: null, colIndex: null });


    const findNoteAtPosition = (rowIndex, colIndex) => {
        return notes.find(note => note.rowIndex === rowIndex && note.colIndex === colIndex);
    };

    const initialPositionRef = useRef({ rowIndex: null, colIndex: null });
    const lastMouseMoveEvent = useRef({ clientX: 0, clientY: 0 });
    const [clickedOnExistingNote, setClickedOnExistingNote] = useState(false);



    const handleMouseMoveOnGrid = (event) => {
        if (!isDragging || !selectedNote) return;

        const { rowIndex, colIndex } = calculateNotePosition(event);
        // Actualiza la posición visual de la nota temporalmente
        // Esto podría implicar redibujar la nota en su nueva posición sin actualizar el estado global
        calculateNotePosition(rowIndex, colIndex, selectedNote);
    };

    const handleMouseUp = () => {
        if (!isDragging || !selectedNote) return;

        setIsDragging(false);

        const { finalRowIndex, finalColIndex } = calculateFinalPosition();
        if (selectedNote && (selectedNote.rowIndex !== finalRowIndex || selectedNote.colIndex !== finalColIndex)) {
            // Aquí, en lugar de dispatch(moveNote(...)), podrías necesitar llamar a updateNotePosition
            // si deseas actualizar también el pitch y startTime de la nota
            dispatch(updateNotePosition({
                noteId: selectedNote.id,
                newRowIndex: finalRowIndex,
                newColIndex: finalColIndex
            }));
        }

        selectNote(null); // Opcional: Resetear la nota seleccionada
    };



    const drawGrid = (ctx) => {
        for (let row = 0; row < numberOfRows; row++) {
            for (let col = 0; col < numberOfColumns; col++) {
                ctx.strokeRect(pianoWidth + (col * cellSize), row * cellSize, cellSize, cellSize);
            }
        }
    };


    const isInPianoRoll = (x) => {
        const limit = 0;
        if (x >= limit) {
            return true;
        }

    }

    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left - pianoWidth;
        const y = event.clientY - rect.top;

        const colIndex = Math.floor(x / cellSize);
        const rowIndex = Math.floor(y / cellSize);

        if (isInPianoRoll(x)) {
            const notePitch = calculatePitchFromRowIndex(rowIndex);
            // Encuentra una nota cuya duración abarque la posición clickeada
            const clickedNote = notes.find(note =>
                note.rowIndex === rowIndex &&
                colIndex >= note.colIndex &&
                colIndex < note.colIndex + note.cellDuration
            );

            if (clickedNote) {
                // Si se hace clic en una nota, seleccionarla
                dispatch(selectNote(clickedNote.id));
                console.log("Nota seleccionada:", clickedNote);
            } else {
                // Crear una nueva nota solo si no estamos en modo arrastre
                if (!isDragging) {
                    const newNote = {
                        id: `note-${Date.now()}`,
                        rowIndex,
                        colIndex,
                        pitch: notePitch,
                        duration: "16n",
                        cellDuration: 2,
                        selected: true,
                    };
                    // Actualiza el estado global con la nueva nota
                    dispatch(insertInMatrix(newNote));
                    selectNote(newNote);
                }
            }
            // Función adicional si es necesaria
            clickOnCanvas(rowIndex, colIndex);
        }
    };



    const clickOnCanvas = (rowIndex, colIndex) => {
        // Aquíconst clickOnCanvas = (rowIndex, colIndex) => {
        const octavaC4aB4 = {
            // 0: "C4",
            // 1: "C#4 / Db4",
            // 2: "D4",
            // 3: "D#4 / Eb4",
            // 4: "E4",
            // 5: "F4",
            // 6: "F#4 / Gb4",
            // 7: "G4",
            // 8: "G#4 / Ab4",
            // 9: "A4",
            // 10: "A#4 / Bb4",
            // 11: "B4"
        };

        const note = octavaC4aB4[rowIndex % 12]; // Asegura que rowIndex siempre esté dentro del rango


        // Aquí deberías también despachar tu acción como antes
        dispatch(selectNote({ rowIndex, colIndex, note }));


    };


    const drawNote = (ctx, note, ghost = false) => {
        // Asumiendo que NOTE_WIDTH y NOTE_HEIGHT están definidos en algún lugar de tu código
        // y representan el ancho y alto de cada celda de nota en el canvas.

        // Convertir rowIndex a la posición vertical y colIndex a la posición horizontal
        const x = note.colIndex * NOTE_WIDTH;
        const y = note.rowIndex * NOTE_HEIGHT;

        // 'cellDuration' determina cuántas celdas ocupa la nota, ajustando el ancho de la nota dibujada
        const width = NOTE_WIDTH * note.cellDuration;
        const height = NOTE_HEIGHT;

        // Elegir el color de la nota basado en si está seleccionada o es un 'ghost'
        const noteColor = NOTE_COLOR ? `rgba(39, 108, 158, 0.5)` : NOTE_COLOR;
        const selectedNoteColor = ghost ? `rgba(0, 0, 0, 0.5)` : SELECTED_NOTE_COLOR;

        // Establecer el color de relleno y dibujar el rectángulo de la nota
        ctx.fillStyle = note.selected ? selectedNoteColor : noteColor;
        ctx.fillRect(x, y, width, height);

        // Opcional: Agregar texto a la nota, como el pitch
        ctx.fillStyle = 'black'; // Color del texto
        ctx.font = '12px Arial';
        ctx.fillText(note.pitch, x + 5, y + NOTE_HEIGHT / 2);
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Definición de los manejadores de eventos
        const handleMouseDown = (event) => {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const colIndex = Math.floor(x / cellSize);
            const rowIndex = Math.floor(y / cellSize);

            // Encuentra una nota cuya duración abarque la posición clickeada
            const clickedNote = notes.find(note =>
                note.rowIndex === rowIndex &&
                colIndex >= note.colIndex &&
                colIndex < note.colIndex + note.cellDuration
            );

            if (clickedNote) {
                // Si se hizo clic en una parte de la nota, configura el estado para reflejar que esta nota fue seleccionada
                dispatch(selectNote({ noteId: clickedNote.id }));

                // Establece el estado inicial para el arrastre (si necesitas esta lógica aquí)
                setIsDragging(true);
                console.log("Nota seleccionada para mover:", clickedNote);

                // Establecer información adicional necesaria para el arrastre, como la posición inicial
                const initialPosition = { x, y, noteId: clickedNote.id };
                // Suponiendo que tengas una función setDragStart para establecer esta información
                calculateNotePosition(initialPosition);
            } else {
                console.log("Clic en el canvas, pero no en una nota");
                // Otras acciones si se hace clic fuera de una nota, como potencialmente iniciar el proceso para dibujar una nueva nota
            }
        };



        const handleMouseMove = (event) => {
            if (isDragging && selectedNote) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                // Aquí, necesitas calcular los nuevos índices basándote en la posición actual del mouse y la posición inicial.
                const newColIndex = Math.floor(x / cellSize);
                const newRowIndex = Math.floor(y / cellSize);


                // Ahora, usa estos índices para actualizar la posición de la nota.
                dispatch(updateNotePosition({ noteId: selectedNote.id, newRowIndex, newColIndex, newPitch: selectedNote.pitch }));
            }

        };


        const handleMouseUp = () => {
            // Aquí tu lógica para manejar mouse up
            console.log("Mouse Up");
            setIsDragging(false);
            // Aquí podrías llamar a handleMouseUp si necesitas procesar algo específico
        };

        // Agrega los manejadores de eventos al canvas
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        // Limpieza: remueve los manejadores de eventos al desmontar el componente
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dispatch, isDragging, notes, selectedNote]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpia el canvas antes de dibujar de nuevo
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibuja el grid primero
        drawGrid(ctx);


        notes.forEach(note => {
            // Asumiendo que 'calculatePitchFromRowIndex' devuelve el pitch correcto basado en rowIndex
            const pitch = calculatePitchFromRowIndex(note.rowIndex);
            // Actualiza la nota con el pitch calculado antes de dibujarla
            const noteToDraw = { ...note, pitch };

            drawNote(ctx, noteToDraw);
        });

        // selectedCells.forEach(cell => drawSelectedCell(ctx, cell));
    }, [darkMode, notes]);


    return (
        <div style={{
            // backgroundImage: `url("${process.env.PUBLIC_URL}/assets/grid-${darkMode ? "02" : "01"}.svg")`,
            // backgroundImage: `url("${process.env.PUBLIC_URL}/assets/grid-${darkMode ? "04" : "06"}.svg")`,

            backgroundColor: darkMode ? "#333" : "#fff",

            // Esto hará que la imagen de fondo cubra completamente el div
        }}>

            <canvas
                ref={canvasRef}
                width={numberOfColumns * cellSize + pianoWidth}
                height={numberOfRows * cellSize}
                onClick={handleCanvasClick}
                className="grid-canvas"
                onMouseDown={handleMouseMoveOnGrid}
                onMouseMove={handleMouseMoveOnGrid}
                onMouseUp={handleMouseUp} // Asegúrate de definir y utilizar handleMouseUp correctamente para gestionar el evento mouseup

            />
            <Piano />
            {/* <PianoVisual octaves={8} /> */}

            <button onClick={() => {
                console.log("Toggling dark mode from", darkMode, "to", !darkMode);
                setDarkMode(!darkMode);
            }}>
                Toggle Dark Mode
            </button>

        </div>
    );
};
export const Gridtest = React.memo(Gridtest1);
