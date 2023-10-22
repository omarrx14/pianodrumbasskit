import React, { useState } from 'react';
import './WindowComponent.css';
import DrumKit from './drumkit12';


function WindowComponent2() {
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
            className="window"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="title-bar" onMouseDown={handleMouseDown}>
                <span>Drum kit</span>
                <button className="close-btn">X</button>
            </div>
            <div className="content">
                <DrumKit />


            </div>
        </div>
    );
}

export default WindowComponent2;

