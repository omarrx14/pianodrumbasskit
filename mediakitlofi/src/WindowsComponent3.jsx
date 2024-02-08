import React, { useState } from 'react';
import './chordsball.css';
import ChordBalloon from './WindowChords';


function WindowComponent3() {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - e.currentTarget.getBoundingClientRect().left,
            y: e.clientY - e.currentTarget.getBoundingClientRect().top
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="window1"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="title-bar" onMouseDown={handleMouseDown}>
                <span>ChordsBallonsProgression</span>
                <button className="close-btn">X</button>
            </div>
            <div className="content">
                <ChordBalloon />





            </div>
        </div>
    );
}

export default WindowComponent3;

