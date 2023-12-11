// ChordBalloon.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

const ChordBalloon = ({ chord }) => {
    const [, drag] = useDrag({
        type: 'chord',
        item: { chord },
    });

    return (
        <div ref={drag} className="chord-balloon">
            {chord.name}
        </div>
    );
};

export default ChordBalloon;
