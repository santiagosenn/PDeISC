import React from 'react';
import './App.css';
import HolaMundo from './components/HolaMundo';
import Tarjeta from './components/Tarjeta';
import Contador from './components/Contador';
import ListaTareas from './components/ListaTareas';
import Formulario from './components/Formulario';

function App() {
  return (
    <div className="App">
      <HolaMundo />
      <Tarjeta 
        nombre="Juan" 
        apellido="Pérez" 
        profesion="Desarrollador" 
        imagen="https://via.placeholder.com/150"
      />
      <Contador />
      <ListaTareas />
      <Formulario />
    </div>
  );
}

export default App;
