import React from 'react';
import NavBar from './components/NavBar';
import ListaCanciones from './components/ListaCanciones';
import ListaArtistas from './components/ListaArtistas';
import FooterBar from './components/FooterBar';

const App = () => {
  return (
      <div className="App">
        <NavBar/>
        <ListaCanciones />
        <ListaArtistas/>
        <FooterBar/>
      </div>
  );
};

export default App;
