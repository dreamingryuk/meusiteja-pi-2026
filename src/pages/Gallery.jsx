// src/pages/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs } from '../config/firebase';

function Gallery() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sites'));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPortfolios(list);
      } catch (error) {
        console.error('Erro ao buscar portfolios:', error);
      }
      setLoading(false);
    };
    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-block mb-6 text-blue-600 hover:underline">
          ← Voltar para o início
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Portfolios criados</h1>
        {portfolios.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Nenhum portfolio encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {portfolios.map((portfolio) => (
              <Link
                key={portfolio.id}
                to={`/portfolio/${portfolio.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {portfolio.foto ? (
                    <img src={portfolio.foto} alt={portfolio.nome} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl text-gray-400">👤</span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 capitalize">
                    {portfolio.nome || 'Anônimo'}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">{portfolio.titulo || 'Sem título'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;