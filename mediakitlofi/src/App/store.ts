import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import reducer from './reducers/reducer';
import matrixReducer from './reducers/matrix.ts';
import progressColumn from './middleware/ProgressColumn';
import playSynth from './middleware/playSynth';



const store = configureStore({
    reducer: {
        drumMachine: reducer,
        matrix: matrixReducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(playSynth, progressColumn  /* Aquí puedes agregar middleware personalizado si es necesario */),
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;


export default store;
