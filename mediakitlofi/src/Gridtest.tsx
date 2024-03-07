


import React, { useRef, useEffect, useState, useContext } from 'react';
import './gridtest.css';
import { ReactReduxContext, useDispatch, useSelector } from 'react-redux';
import { insertInMatrix, moveNote, selectNote, setSelectedNote, toggleNoteSelection, updateNotePosition, setSelectedCells } from './timelineslice.ts';
import { useDarkMode, useNotes } from './App/components/context.js'; // Asegúrate de importar correctamente tus hooks
import { audioModule } from './App/audiocontext/AudioModule.js'; // Asumiendo que este es el módulo de audio
import { NoteData } from "./note.ts";
import { Note } from 'tone/build/esm/core/type/NoteUnits';

interface GridProps {
    handleMouseDownOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMoveOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}



export const Gridtest = ({ slots
}: GridProps): JSX.Element => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const numberOfRows = 12;
    const numberOfColumns = 20;
    const cellSize = 25; // Tamaño de cada celda en píxeles
    const rowSize = 25;
    const headerSize = 30;
    const NOTE_WIDTH = 25; // Tamaño de la nota en píxeles (ancho)
    const NOTE_HEIGHT = 25; // Tamaño de la nota en píxeles (alto)
    const SELECTED_NOTE_COLOR = '#yellow'; // Color para la nota seleccionada
    const NOTE_COLOR = '#red'; // Color para las notas no seleccionadas
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
            "C4", "C#4 / Db4", "D4", "D#4 / Eb4", "E4", "F4", "F#4 / Gb4", "G4", "G#4 / Ab4", "A4", "A#4 / Bb4", "B4"
        ];

        if (rowIndex < 0 || rowIndex > 11) {
            console.error("rowIndex fuera de rango");
            return ""; // 
        }

        return noteNames[rowIndex];
    };

    const { darkMode, setDarkMode } = useDarkMode();
    const { notes1, setNotes1 } = useNotes();
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );
    const { selectedNote, isPlaying, currentTime, matrix, pianoRoll } = useSelector((state) => state.timeline);
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

    // const handleMouseMoveOnGrid = (event) => {
    //     if (!isDragging || !selectedNote) return;

    //     const rect = canvasRef.current.getBoundingClientRect();
    //     const x = event.clientX - rect.left - pianoWidth;
    //     const y = event.clientY - rect.top;
    //     const rowIndex = Math.floor(y / cellSize);
    //     const colIndex = Math.floor(x / cellSize);

    //     // Actualiza las coordenadas temporales para el indicador visual
    //     lastMouseMoveEvent.current = { rowIndex, colIndex };

    //     // Opcional: Verifica si la posición ha cambiado antes de redibujar para optimizar el rendimiento
    //     if (rowIndex !== lastMouseMoveEvent.current.rowIndex || colIndex !== lastMouseMoveEvent.current.colIndex) {
    //         // Llama a una función para redibujar el grid y la nota en la posición temporal
    //         tempNotePosition(rowIndex, colIndex, selectedNote);
    //     }
    // };


    // const handleMouseDownOnGrid = (event) => {
    //     setIsDragging(true);
    //     const { rowIndex, colIndex } = calculateNotePosition(event);

    //     const note = findNoteAtPosition(rowIndex, colIndex);
    //     if (note) {
    //         selectNote(note); // Asumiendo que setSelectedNote actualiza el estado para la nota seleccionada
    //         // Guarda la posición inicial para comparar después
    //         initialPositionRef.current = { rowIndex, colIndex };
    //     }
    // };

    // const handleMouseUp = () => {
    //     if (!isDragging || !selectedNote) return;

    //     setIsDragging(false);

    //     // Calcula la posición final basada en el último evento de mouseMove.
    //     const rect = canvasRef.current.getBoundingClientRect();
    //     const x = lastX - rect.left - pianoWidth; // Asume que lastX y lastY se actualizaron en handleMouseMove
    //     const y = lastY - rect.top;
    //     const finalRowIndex = Math.floor(y / cellSize);
    //     const finalColIndex = Math.floor(x / cellSize);

    //     // Actualiza la nota en el estado global solo si se ha movido a una nueva posición.
    //     if (selectedNote && (selectedNote.rowIndex !== finalRowIndex || selectedNote.colIndex !== finalColIndex)) {
    //         dispatch(moveNote({
    //             noteId: selectedNote.id,
    //             newRowIndex: finalRowIndex,
    //             newColIndex: finalColIndex
    //         }));
    //     }

    //     selectNote(null); // Opcional: Resetear la nota seleccionada.
    // };


    const handleMouseMoveOnGrid = (event) => {
        if (!isDragging || !selectedNote) return;

        const { rowIndex, colIndex } = calculateNotePosition(event);
        // Actualiza la posición visual de la nota temporalmente
        // Esto podría implicar redibujar la nota en su nueva posición sin actualizar el estado global
        tempNotePosition(rowIndex, colIndex, selectedNote);
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




    // const drawSelectedCell = (ctx, cells, options = {}) => {
    //     console.log(cells)
    //     const { rowIndex, colIndex, cellDuration } = cells;
    //     const { fillColor = 'red' } = options;

    //     // Ajusta la posición x de la celda seleccionada para incluir el pianoWidth
    //     const xPosition = (colIndex * cellSize); // Añade pianoWidth aquí

    //     ctx.fillStyle = fillColor;
    //     ctx.fillRect(xPosition, rowIndex * cellSize, cellSize * cellDuration, cellSize);
    // };


    const isInPianoRoll = (x) => {
        const limit = 0;
        if (x >= limit) {
            return true;
        }

    }

    const isAKey = (x) => {



    }

    // const handleCanvasClick = (event) => {
    //     const rect = canvasRef.current.getBoundingClientRect();
    //     const x = event.clientX - rect.left - pianoWidth;
    //     const y = event.clientY - rect.top;

    //     const colIndex = Math.floor(x / cellSize);
    //     const rowIndex = Math.floor(y / cellSize);

    //     if (isInPianoRoll(x)) {
    //         const notePitch = calculatePitchFromRowIndex(rowIndex);

    //         const clickedNote = notes.find(note => note.rowIndex === rowIndex && note.colIndex === colIndex);

    //         if (clickedNote) {
    //             selectNote(clickedNote);
    //             console.log("selectNote")
    //         } else {
    //             const newNote = {
    //                 id: `note-${Date.now()}`,
    //                 rowIndex,
    //                 colIndex,
    //                 pitch: notePitch,
    //                 duration: "16n",
    //                 cellDuration: 2,
    //                 selected: true,
    //             };
    //             // moveNote(prevNotes => [...prevNotes, newNote]);
    //             // selectNote(clickedNote);
    //             // dispatch(insertInMatrix({ note: notePitch }));
    //             dispatch(insertInMatrix(newNote));
    //             selectNote(newNote);
    //         }

    //         clickOnCanvas(rowIndex, colIndex);
    //     }

    //     if (isAKey()) {

    //     }

    // };
    const handleCanvasClick = (event) => {

        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left - pianoWidth;
        const y = event.clientY - rect.top;

        const colIndex = Math.floor(x / cellSize);
        const rowIndex = Math.floor(y / cellSize);

        if (isInPianoRoll(x)) {
            const notePitch = calculatePitchFromRowIndex(rowIndex);
            const clickedNote = notes.find(note => note.rowIndex === rowIndex && note.colIndex === colIndex);

            if (clickedNote) {
                selectNote(clickedNote);
                console.log("selectNote")

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
                    // Aquí deberías usar dispatch para actualizar el estado global si estás usando Redux
                    // Por ejemplo:
                    // dispatch(insertInMatrix(newNote));
                    selectNote(newNote);
                }
            }
            clickOnCanvas(rowIndex, colIndex);

        }
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


        // Aquí deberías también despachar tu acción como antes
        dispatch(insertInMatrix({ rowIndex, colIndex, note }));


    };



    // const drawNote = (ctx: CanvasRenderingContext2D, note: NoteData, ghost: boolean = false) => {
    //     const x = note.pitch * NOTE_WIDTH;
    //     const y = (note.length - 1 - note.row) * NOTE_HEIGHT;
    //     const width = NOTE_WIDTH * note.units; // 'units' determina cuántas celdas ocupa la nota
    //     const height = NOTE_HEIGHT;

    //     const noteColor = ghost ? `rgba(0, 0, 0, 0.5)` : NOTE_COLOR;
    //     const selectedNoteColor = ghost ? `rgba(255, 0, 0, 0.1)` : SELECTED_NOTE_COLOR;

    //     ctx.fillStyle = note.selected ? selectedNoteColor : noteColor;
    //     ctx.fillRect(x, y, width, height);

    //     // Opcional: Agregar texto a la nota
    //     ctx.fillStyle = 'red';
    //     ctx.font = '12px Arial';
    //     ctx.fillText(note.pitch, x + 5, y + NOTE_HEIGHT / 2);

    //     const ellipsized = (note: number, maxLength: string) => {
    //         if (maxLength < 0) return ''
    //         if (note.length > maxLength) {
    //             return note.slice(0, maxLength) + "..";
    //         }
    //         return note;
    //     }
    //     let maxLength = 3;
    //     switch (note.units) {
    //         case 1:
    //             maxLength = -1;
    //             break;
    //         case 2:
    //             maxLength = 0;
    //             break;
    //         case 3:
    //             maxLength = 1;
    //     }
    //     ctx.fillText(ellipsized(note.pitch || '', maxLength), x + 2, y + 21);
    // };
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
        const noteColor = NOTE_COLOR ? `rgba(0, 0, 0, 0.5)` : NOTE_COLOR;
        const selectedNoteColor = ghost ? `rgba(255, 0, 0, 0.1)` : SELECTED_NOTE_COLOR;

        // Establecer el color de relleno y dibujar el rectángulo de la nota
        ctx.fillStyle = note.selected ? selectedNoteColor : noteColor;
        ctx.fillRect(x, y, width, height);

        // Opcional: Agregar texto a la nota, como el pitch
        ctx.fillStyle = 'black'; // Color del texto
        ctx.font = '12px Arial';
        ctx.fillText(note.pitch, x + 5, y + NOTE_HEIGHT / 2);
    };



    // useEffect(() => {
    //     console.log("12312")
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     drawGrid(ctx);
    //     drawPiano(ctx);
    //     drawNotes(ctx); // Dibuja las notas en el grid
    //     // Dibuja las celdas seleccionadas
    //     selectedCells.forEach(notes => drawSelectedCell(ctx, notes));
    //     // selectedCells.forEach(cell => drawSelectedCell(ctx, cell.rowIndex, cell.colIndex));

    //     setContext(ctx);




    // Función para dibujar notas en el canvas
    const drawNotes = (ctx) => {
        notes.forEach((note) => drawNote(ctx, note));
    };


    // }, [selectedCells, darkMode, notes]); // Añadir 'notes' como dependencia

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Definición de los manejadores de eventos
        const handleMouseDown = (event) => {
            // Aquí tu lógica para manejar mouse down
            console.log("Mouse Down");
            setIsDragging(true);
            // Aquí podrías llamar a handleMouseDownOnGrid si necesitas procesar algo específico
        };

        const handleMouseMove = (event) => {
            // Aquí tu lógica para manejar mouse move
            if (isDragging) {
                console.log("Mouse Move");
                // Aquí podrías llamar a handleMouseMoveOnGrid si necesitas procesar algo específico
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
    }, [isDragging]);

    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d');
    //     // Considera si necesitas limpiar solo la sección del grid aquí
    //     // Ejemplo de cómo podrías llamar a drawNote con una nota
    //     // Asumiendo que ctx es tu contexto de canvas y que tienes una nota para dibujar
    //     const note = {
    //         rowIndex: 2, // Posición Y basada en la fila
    //         colIndex: 3, // Posición X basada en la columna
    //         pitch: calculatePitchFromRowIndex(2), // Convertir rowIndex a pitch
    //         duration: "16n",
    //         cellDuration: 2, // Asume que la nota ocupa 2 celdas
    //         selected: true, // Si la nota está seleccionada
    //     };

    //     drawNote(ctx, note);

    //     drawGrid(ctx); // Dibuja el grid
    //     selectedCells.forEach(note => drawSelectedCell(ctx, note));

    //     // Dibuja las celdas seleccionadas, si aplica
    // }, [selectedCells, darkMode, notes]); // Especifica las dependencias que afectan el grid y las notas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpia el canvas antes de dibujar de nuevo
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibuja el grid primero
        drawGrid(ctx);

        // Dibuja cada nota en selectedCells o notes
        // Asegúrate de que 'notes' es el array que contiene las notas a dibujar
        notes.forEach(note => {
            // Asumiendo que 'calculatePitchFromRowIndex' devuelve el pitch correcto basado en rowIndex
            const pitch = calculatePitchFromRowIndex(note.rowIndex);
            // Actualiza la nota con el pitch calculado antes de dibujarla
            const noteToDraw = { ...note, pitch };

            drawNote(ctx, noteToDraw);
        });

        // Si aún necesitas dibujar celdas seleccionadas de manera diferente, puedes hacerlo aquí
        // selectedCells.forEach(cell => drawSelectedCell(ctx, cell));
    }, [selectedCells, darkMode, notes]); // Asegúrate de que 'notes' esté incluido en las dependencias si lo usas


    return (
        <div className="grid-canvas-container" style={{
            // backgroundImage: `url("${process.env.PUBLIC_URL}/assets/grid-${darkMode ? "02" : "01"}.svg")`,
            backgroundColor: darkMode ? "#333" : "#fff",

            backgroundSize: 'cover', // Esto hará que la imagen de fondo cubra completamente el div
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
            <button onClick={() => {
                console.log("Toggling dark mode from", darkMode, "to", !darkMode);
                setDarkMode(!darkMode);
            }}>
                Toggle Dark Mode
            </button>

        </div>
    );
};
