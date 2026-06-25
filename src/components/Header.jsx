// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MeuSiteJa
      </Link>
      <nav className="flex items-center gap-4">
        <Link to="/galeria" className="text-gray-700 hover:text-blue-600 transition">
          Ver Portfólios
        </Link>
        {user ? (
          <>
            <Link to="/preview" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Meu Site
            </Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition">
              Sair
            </button>
          </>
        ) : (
          <Link to="/criar" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Criar meu site
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;