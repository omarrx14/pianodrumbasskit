import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import matrixReducer from './reducers/matrix.ts';
import progressColumn from './middleware/ProgressColumn';
import playSynth from './middleware/playSynth';
import timelineReducer from '../timelineslice.ts'; // Importa el reducer del timeline



const store = configureStore({
    reducer: {
        matrix: matrixReducer,
        timeline: timelineReducer, // Añade el reducer del timeline aquí

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(playSynth, progressColumn  /* Aquí puedes agregar middleware personalizado si es necesario */),
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;


export default store;
