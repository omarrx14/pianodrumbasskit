// import React, { useState } from 'react';
// import './pianroll.css';



// const PianoRoll = () => {
//     // Inicializa un estado para almacenar las notas activas
//     const [activeNotes, setActiveNotes] = useState([]);
//     const [notes, setNotes] = useState([]);

//     // Función para activar una nota
//     const activateNote = (note, time) => {
//         setActiveNotes(prevNotes => [...prevNotes, { note, time }]);
//     };

//     // Crear las celdas del piano roll
//     const cells = [];
//     for (let i = 0; i < 128; i++) {
//         cells.push(
//             <div key={i} className="piano-roll-cell">
//                 {/* Aquí podrías mostrar información de la nota si está activa */}
//             </div>
//         );
//     }

//     return (
//         <div className="piano-roll">
//             {cells}
//         </div>
//     );
// };

// export default PianoRoll;
