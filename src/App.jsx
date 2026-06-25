// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from './pages/Hero';
import Gallery from './pages/Gallery';
import Preview from './pages/Preview';
import Form from './components/FormFlow'; // ou seu formulário

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/galeria" element={<Gallery />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/criar" element={<Form />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;