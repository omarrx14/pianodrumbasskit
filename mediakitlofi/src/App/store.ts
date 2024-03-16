import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import matrixReducer from './DrumKitLegacy/reducers/matrix.ts';
import timelineReducer from '../App/PianoRollComp/Reducer/timelineslice.ts'; // Importa el reducer del timeline



const store = configureStore({
    reducer: {
        matrix: matrixReducer,
        timeline: timelineReducer, // Añade el reducer del timeline aquí

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(  /* Aquí puedes agregar middleware personalizado si es necesario */),
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;


export default store;
