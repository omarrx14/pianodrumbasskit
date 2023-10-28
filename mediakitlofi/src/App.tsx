import React from 'react';
import { Provider } from 'react-redux';
import store from './App/store.ts'
import './App.css';
import WindowComponent from './WindowComponent';
import WindowComponent2 from './WindowComponent2';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <WindowComponent />
        <WindowComponent2 />
      </div>
    </Provider>
  );
}

export default App;