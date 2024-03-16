import React, { useState, startTransition } from 'react';
import { createRoot } from 'react-dom/client';

import './WindowComponent.css';
// import Piano from './/pianokeyboard';
import Keyboard from './MidiKeyboard'
import DrumPads from '../DrumPadsComponents/Drumpads'
import Knobs from '../DrumPadsComponents/Knob'
import Buttons from '../DrumPadsComponents/Buttons'
import Sliders from '../DrumPadsComponents/slider'
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// import App from '../../../App';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.



function WindowComponent() {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        startTransition(() => {
            setInputValue(event.target.value);
        });


    };



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
    const CameraController = () => {
        const { camera } = useThree(); // Accede a la cámara desde el hook useThree
        camera.position.set(0, 5, 0); // Posición de la cámara: X, Y, Z (Y es hacia arriba)
        camera.lookAt(0, 0, 0); // Hace que la cámara mire hacia el centro de la escena
        return <OrbitControls />;
    };

    return (
        <div
            className="window"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="title-bar" onMouseDown={handleMouseDown}>
                <span>Piano</span>
                <button className="close-btn">X</button>
            </div>
            <Canvas>
                <Keyboard position={[0, -10, -10]} /> {/* Ajusta la posición según sea necesario */}
                <DrumPads position={[-10, 0, 0]} /> {/* Asume que DrumPads acepta una prop de posición y ajusta según sea necesario */}
                <Knobs position={[-10, 0, 0]} />
                {/* <Buttons /> */}
                {/* <Sliders /> */}
                {/* <DrumPads /> */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <CameraController />

            </Canvas>
        </div>
    );

}

export default WindowComponent;

