import React from 'react'
import Row from '../reducers/Row';
import { useAppSelector, useAppDispatch } from '../hooks';
import { selectMatrix, selectActiveColumn, toggleStep, ICoordinates } from '../reducers/matrix';
import './App.css';

const Grid = () => {
    const matrix = useAppSelector(selectMatrix);
    const activeColumn = useAppSelector(selectActiveColumn);
    const dispatch = useAppDispatch();
    return (
        <div className='grid'>
            {matrix.map((row, rowIndex) => (
                <Row key={rowIndex + "-"}
                    row={row}
                    rowIndex={rowIndex}
                    activeColumn={activeColumn}
                    onSquareClick={(coords: ICoordinates) => dispatch(toggleStep(coords))}
                />
            ))}
        </div>
    );
}

export default Grid;