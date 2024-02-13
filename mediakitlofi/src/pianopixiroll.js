import React, { useState } from 'react';
import './pianroll.css'; // Asegúrate de crear este archivo CSS para estilizar tu piano roll

const PianoRoll = () => {
    const numRows = 12; // Número de notas
    const numCols = 32; // Número de pasos

    // Función para manejar el clic en una celda
    const toggleNote = (row, col) => {
        // Aquí, podrías actualizar el estado o manejar la lógica para reproducir la nota
        // o almacenar su estado para la reproducción
        console.log(`Note toggled at row ${row}, col ${col}`);
    };

    // Generar la cuadrícula
    const generateGrid = () => {
        let grid = [];
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                grid.push(

                    <div
                        key={`${row}-${col}`}
                        className="cell"
                        onClick={() => toggleNote(row, col)}
                        data-row={row}
                        data-col={col}

                    />
                );
            }
        }
        return grid;
    };

    return (

        <div id="pianoRoll" className="piano-roll-grid">
            {generateGrid()}

        </div>

    );
};

export default PianoRoll;
