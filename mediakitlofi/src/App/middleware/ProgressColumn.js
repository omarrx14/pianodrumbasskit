import { nextColumn } from '../reducers/matrix.ts'

const progressColumn = (store) => (next) => (action) => {
    if (action.type === 'matrix/play') {
        action.payload = setInterval(() => store.dispatch(nextColumn()), 500);
    }
    else if (action.type === 'matrix/pause') {
        clearInterval(store.getState().matrix.interval);
    }
    next(action);
};

export default progressColumn;