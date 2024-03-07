// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectBPM, setBPM } from './matrixSlice';

// const BPMControl = () => {
//     const dispatch = useDispatch();
//     const bpm = useSelector(selectBPM);

//     const handleBPMChange = (e) => {
//         dispatch(setBPM(Number(e.target.value)));
//     };

//     return (
//         <div>
//             <label htmlFor="bpm">BPM: {bpm}</label>
//             <input
//                 type="range"
//                 id="bpm"
//                 min="60"
//                 max="180"
//                 value={bpm}
//                 onChange={handleBPMChange}
//             />
//         </div>
//     );
// };

// export default BPMControl;
