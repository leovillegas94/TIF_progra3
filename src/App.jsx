import React from 'react';
import ListaCanciones from './components/ListaCanciones';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1>Lista de Canciones</h1>
      <ListaCanciones />
    </div>
  );
};

export default App;