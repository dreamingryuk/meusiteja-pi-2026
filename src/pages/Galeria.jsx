import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs } from '../config/firebase';

function Galeria() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      setError('');
      try {
        const querySnapshot = await getDocs(collection(db, 'sites'));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setPortfolios(data);
      } catch (error) {
        console.error('Erro ao buscar portfolios:', error);
        setError('Erro ao carregar portfolios. Verifique as regras do Firestore.');
      }
      setLoading(false);
    };

    fetchPortfolios();
  }, []);

  const handleCardClick = (portfolio) => {
    if (portfolio.subdominio) {
      navigate(`/portfolio/${portfolio.subdominio}`);
    } else {
      navigate(`/portfolio/${portfolio.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Portfolios</h1>
          <div className="space-x-3">
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Início
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando portfolios...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && portfolios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum portfolio encontrado ainda.</p>
            <p className="text-gray-400">Seja o primeiro a criar o seu!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div 
              key={portfolio.id}
              onClick={() => handleCardClick(portfolio)}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:scale-105 duration-200 group"
            >
              <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center relative">
                {portfolio.foto ? (
                  <img 
                    src={portfolio.foto} 
                    alt={portfolio.nome || 'Portfolio'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl text-white/50">📷</span>
                )}
                {/* Link visível ao passar o mouse (opcional) */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  /portfolio/{portfolio.subdominio || portfolio.id}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                  {portfolio.nome || 'Sem nome'}
                </h2>
                <p className="text-gray-600 text-sm capitalize">
                  {portfolio.titulo || 'Profissional'}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {portfolio.tecnicas && portfolio.tecnicas.split(',').slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                  <span>{portfolio.subdominio || 'meusite'}.meusite.com</span>
                  <span className="text-blue-500">Ver mais →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Galeria;