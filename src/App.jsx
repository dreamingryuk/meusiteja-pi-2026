import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from './pages/Hero';
import Galeria from './pages/Galeria';
import Preview from './pages/Preview';
import Formulario from './pages/Formulario';
import PortfolioPublico from './pages/PortfolioPublico';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/galeria" element={<Galeria />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/criar" element={<Formulario />} />
      <Route path="/portfolio/:subdominio" element={<PortfolioPublico />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;