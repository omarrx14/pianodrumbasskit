import React from 'react';
import Draggable from 'react-draggable';

function DraggablePiano() {
    return (
        <Draggable>
            <div>
                <Piano />
            </div>
        </Draggable>
    );
}

export default DraggablePiano;
