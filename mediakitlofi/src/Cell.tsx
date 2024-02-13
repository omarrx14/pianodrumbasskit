import React, { useState } from 'react';
import * as Tone from 'tone';

const Cell: React.FC<{
}> = ({ rowIndex, colIndex, onClick, notes, isDragging }) => {
    const [color, setColor] = useState('#eee'); // Color inicial de la caja

    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        console.log(`${rowIndex} - ${colIndex} enter`)

        return setIsHovering(true)
    };
    const handleMouseLeave = () => {
        console.log(`${rowIndex} - ${colIndex} leave`)
        setIsHovering(false)
    };

    const handleClick = async () => {
        setColor("red");
        console.log(`${rowIndex} - ${colIndex} click`)

        onClick(rowIndex, colIndex);

        // if (rowIndex === 0) {
        //     if (Tone.context.state !== 'running') await Tone.start();

        //     const synth = new Tone.Synth().toDestination();

        //     synth.triggerAttackRelease("C4", "8n");
        // }
        // console.log(`${rowIndex} - ${colIndex} click`);
        // Aquí puedes agregar cualquier otra lógica de clic que necesites



    };

    const estilosCaja = {
        backgroundColor: notes.length > 0 ? 'red' : '#eee',
        border: notes.length > 0 ? "1px solid red" : "1px solid #ddd"
    };


    const handleDragStart = (e) => {
        setIsDragging(true);
        // Lógica de arrastre...
    };



    return (
        <div className="cell"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick} // Usa handleClick aquí
            style={estilosCaja}
            data-row={rowIndex} data-col={colIndex}></div>
    );
}

export default Cell;