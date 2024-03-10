import React from 'react';
import { Provider } from 'react-redux';
import store from './App/store.ts';
import './App.css';
// import WindowComponent from './WindowComponent';
import WindowComponent2 from './App/DrumKitLegacy/WindowComponent2.jsx';
import WindowComponent3 from './App/PianoRollComp/DraggableComponent/WindowsComponent3';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { NotesProvider, PlayingProvider, SnapValueProvider, DarkModeProvider } from './App/components/context.js'; // Asegúrate de que la ruta de importación sea correcta

function App() {
  return (
    <Provider store={store}>

      <DndProvider backend={HTML5Backend}>
        <NotesProvider>
          <SnapValueProvider>
            <PlayingProvider>
              <DarkModeProvider >

                <div className="App">
                  {/* Comenta o descomenta según necesites usar estos componentes */}
                  {/* <WindowComponent /> */}
                  {/* <WindowComponent2 /> */}
                  <WindowComponent3 />
                </div>
              </DarkModeProvider>

            </PlayingProvider>
          </SnapValueProvider>
        </NotesProvider>
      </DndProvider>
    </Provider>
  );
}

export default App;