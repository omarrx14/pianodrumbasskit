import React, { useState } from 'react';
import * as Tone from 'tone';
import { useDispatch } from 'react-redux';
import { alargarNota } from './timelineslice.ts'; // Asegúrate de que esta importación sea correcta

// Asegúrate de pasar las props necesarias correctamente desde el componente padre
const Cell = ({ rowIndex, colIndex, onClick, notes = [], isDragging, onNoteSelectionChange, isMarked }) => {
    const dispatch = useDispatch();

    // Estado para manejar el color de fondo de la celda, se actualiza según si hay notas
    const [color, setColor] = useState('#eee'); // Color inicial de la caja
    const [isHovering, setIsHovering] = useState(false); // Estado para manejar el hover

    // Manejador para cuando el mouse entra en la celda
    const handleMouseEnter = () => {
        setIsHovering(true);
        console.log(`${rowIndex} - ${colIndex} enter`);
    };

    // Manejador para cuando el mouse sale de la celda
    const handleMouseLeave = () => {
        setIsHovering(false);
        console.log(`${rowIndex} - ${colIndex} leave`);
    };

    // Manejador para cuando se hace clic en la celda
    const handleClick = async () => {
        setColor("red"); // Cambia el color para indicar selección/actividad
        console.log(`${rowIndex} - ${colIndex} click`);
        onClick(rowIndex, colIndex); // Llama a la función onClick pasada como prop
    };

    // Estilos de la celda, se actualizan según si hay notas en esta posición

    const estilosCaja = {
        backgroundColor: notes.length > 0 ? 'red' : '#eee',
        border: notes.length > 0 ? "1px solid red" : "1px solid #ddd"
    };

    // const estilosCaja = isMarked ? {
    //     backgroundColor: 'red'
    // } : {
    //     // border: notes.length > 0 ? "1px solid red" : "1px solid #ddd"
    //     border: notes.length > 0 ? "1px solid red" : "1px solid #ddd"

    // };


    return (
        <div className="cell"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={estilosCaja}
            data-row={rowIndex} data-col={colIndex}
        >
        </div>
    );
};

export default Cell;
