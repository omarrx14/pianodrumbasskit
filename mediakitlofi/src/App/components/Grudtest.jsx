import React, { useRef, useState, useEffect } from 'react';
import { useNotes } from './context'; // Asegúrate de importar correctamente tus hooks

export const GridTest = () => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const notes = useNotes(); // Usa el hook personalizado para acceder a las notas

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            setContext(ctx);
        }
    }, []);

    const NOTE_WIDTH = 10;
    const NOTE_HEIGHT = 10;

    const placeNote = (note) => {
        if (!context || !canvasRef.current) return;

        const x = note.column * NOTE_WIDTH;
        const y = note.row * NOTE_HEIGHT;
        const width = NOTE_WIDTH * note.units;
        const height = NOTE_HEIGHT;

        context.fillStyle = "red";
        context.fillRect(x, y, width, height);
    };

    const handleMouseDownOnGrid = (e) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const column = Math.floor(x / NOTE_WIDTH);
        const row = Math.floor(y / NOTE_HEIGHT);

        // Implementa aquí la lógica para manejar el clic en una posición específica
    };

    useEffect(() => {
        if (context && notes) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            notes.forEach(placeNote);
        }
    }, [context, notes]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={600}
                height={300}
                onMouseDown={handleMouseDownOnGrid}
            />
        </div>
    );
};
