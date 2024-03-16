import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCellsCount } from './timelineslice.ts'; // Ajusta la importación según tu estructura de archivos

export const SliderComponent = () => {
    const dispatch = useDispatch();
    const selectedCellsCount = useSelector(state => state.tuReducer.selectedCellsCount); // Asegúrate de usar el path correcto

    const handleSliderChange = (event) => {
        dispatch(setSelectedCellsCount(parseInt(event.target.value, 10)));
    };

    return (
        <div>
            <input
                type="range"
                min="1"
                max="6"
                value={selectedCellsCount}
                onChange={handleSliderChange}
            />
            <p>Número de casillas seleccionadas: {selectedCellsCount}</p>
        </div>
    );
};

export default SliderComponent;
