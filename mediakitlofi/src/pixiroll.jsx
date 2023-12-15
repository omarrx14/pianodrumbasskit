import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { getNoteRange, drawPianoKeys, drawGridLines, setupInteraction } from './pianoHelpers'; // Suponiendo que tienes funciones auxiliares para dibujar el piano y la cuadrícula.

const PianoRoll = ({ width, height, noteData }) => {
    const pianoRollRef = useRef(null);
    const app = useRef(null);

    useEffect(() => {
        // Inicializa la aplicación de Pixi.js solo una vez (al montar el componente)
        if (!app.current) {
            app.current = new PIXI.Application({
                width,
                height,
                backgroundColor: 0x000000, // Color de fondo, puede ser cambiado según la preferencia.
                antialias: true, // Mejora la calidad de las líneas y bordes.
            });

            pianoRollRef.current.appendChild(app.current.view);

            // Calcula el rango de notas basado en los datos proporcionados
            const noteRange = getNoteRange(noteData);

            // Dibuja las teclas del piano
            drawPianoKeys(app.current, noteRange);

            // Dibuja las líneas de la cuadrícula
            drawGridLines(app.current, width, height);

            // Configura la interacción (clicks, hover, etc.)
            setupInteraction(app.current);
        }
    }, [width, height, noteData]); // Las dependencias aseguran que el efecto se ejecute solo cuando cambien.

    // Asegúrate de limpiar la aplicación de Pixi.js cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (app.current) {
                app.current.destroy(true, { children: true });
                app.current = null;
            }
        };
    }, []);

    return <div ref={pianoRollRef} />;
};

export default PianoRoll;
