import React from 'react';
import { Provider } from 'react-redux';
import store from './App/store.ts';
import './App.css';
import WindowComponent from './WindowComponent';
import WindowComponent2 from './WindowComponent2';
import WindowComponent3 from './WindowsComponent3';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <WindowComponent />
          <WindowComponent2 />
          {/* <WindowComponent3 /> */}
        </div>
      </DndProvider>
    </Provider>
  );
}

export default App;
