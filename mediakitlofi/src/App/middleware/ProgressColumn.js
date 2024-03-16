import { nextColumn } from '../reducers/matrix.ts'

const progressColumn = (store) => (next) => (action) => {
    if (action.type === 'matrix/play') {
        action.payload = setInterval(() => store.dispatch(nextColumn()), 60000 / store.getState().matrix.bpm);
    }
    else if (action.type === 'matrix/pause') {
        clearInterval(store.getState().matrix.interval);
    } else if (action.type === 'matrix/setBPM') {
        // Todo hacer el bpm dinamico
    }
    next(action);
};

export default progressColumn;
