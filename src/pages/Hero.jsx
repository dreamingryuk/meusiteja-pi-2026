// src/pages/Hero.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

function Hero() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (isLoggedIn) {
      navigate('/preview');
    } else {
      navigate('/criar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
          MeuSiteJa
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-6">
          Crie seu portfólio profissional em minutos, totalmente grátis!
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Desenvolvido por 5 alunos do IFC Campus Concórdia
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            {isLoggedIn ? 'Editar meu site' : 'Criar meu site'}
          </button>
          <Link
            to="/galeria"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border border-blue-200"
          >
            Ver portfolios
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;