import React from 'react';
import Cell from './Cell.tsx'; // Asume que tienes un componente Cell definido


const Bar = ({ rowIndex, cells, onCellClick, onDragStart, onDragOver, onDrop, draggingBar }) => {
    return (
        <div
            className="bar"
            draggable={true}
            onDragStart={(e) => onDragStart(e, rowIndex)}
            onDragOver={(e) => e.preventDefault()} // Necesario para permitir el drop
            onDrop={(e) => onDrop(e, rowIndex)}
        >
            {cells.map((cell, index) => (
                <Cell
                    key={`${rowIndex}-${index}`}
                    rowIndex={rowIndex}
                    colIndex={index}
                    cell={cell}
                    onClick={() => onCellClick(rowIndex, index)}
                />
            ))}
        </div>
    );
};


const chunkRowIntoBars = (row) => {
    let bars = [];
    for (let i = 0; i < row.length; i += 4) {
        bars.push(row.slice(i, i + 4));
    }
    return bars;
};



export default Bar;
