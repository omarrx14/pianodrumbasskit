import { useContext, useEffect, useRef, useState } from "react";



export const Grid = ({
    handleMouseDownOnGrid,
    handleMouseMoveOnGrid,
}: GridProps): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { layers } = useContext(LayersContext);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );
    const [gridWidth, setGridWidth] = useState<number>(window.innerWidth);

    const gridRef = useContext(GridRefContext);

    const pianoRollRef = useContext(PianoRollRefContext);
    const gridImgRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        setContext(ctx);
    }, []);


    const placeNote = (note: NoteData, ghost = false) => {
        if (!context) return;
        const x = note.column * NOTE_WIDTH;
        const y = (allNotes.length - 1 - note.row) * NOTE_HEIGHT;
        const height = NOTE_HEIGHT;
        const width = NOTE_WIDTH * note.units;

        const noteColorRGB = hexToRgb(NOTE_COLOR);
        const noteColor = `rgba(${noteColorRGB.r}, ${noteColorRGB.g}, ${noteColorRGB.b
            }, ${ghost ? 0.5 : 1})`;

        const selectedNoteColorRGB = hexToRgb(SELECTED_NOTE_COLOR);
        const selectedNoteColor = `rgba(${selectedNoteColorRGB.r}, ${selectedNoteColorRGB.g
            }, ${selectedNoteColorRGB.b}, ${ghost ? 0.1 : 1})`;

        context.fillStyle = note.selected ? selectedNoteColor : noteColor;
        context.fillRect(x, y, width, height);
        if (ghost) return;



        context.strokeStyle = NOTE_STROKE_COLOR;
        context.strokeRect(x, y, width, height);
        context.fillStyle = "black";
        context.font = "16px sans-serif";

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
        context.fillText(ellipsized(note.note, maxLength), x + 2, y + 21);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        pianoRollRef.current?.scrollTo(0, 1000); // scroll to c5
    }, []);

    useEffect(() => {
        if (!context) return;

        const farthestCol =
            notes.notes.length > 0 ? getNearestBar(notes.notes) : 0;
        const gridWidth = (farthestCol + 1) * NOTE_WIDTH + 3000;

        if (gridImgRef.current) {
            gridImgRef.current.style.minWidth = gridWidth + "px";
        }
        setGridWidth(gridWidth);

        context.clearRect(0, 0, gridWidth, PIANO_ROLL_HEIGHT);

        if (layers.length > 0) {
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].id === notes.id) continue;
                for (let j = 0; j < layers[i].notes.length; j++) {
                    const note = layers[i].notes[j];
                    placeNote(note, true);
                }
            }

            // render selected layer last to make sure it's on top
            for (let i = 0; i < notes.notes.length; i++) {
                const note = notes.notes[i];
                placeNote(note);
            }
        }
    }, [notes, context, gridWidth]);