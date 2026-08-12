import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, collection, query, where, getDocs } from '../config/firebase';
import TemplateRenderer from '../components/templates/TemplateRenderer';
import DEMO_PORTFOLIOS from '../data/demoPortfolios';

function PortfolioPublico() {
  const { subdominio } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError('');
      let found = null;

      try {
        const q = query(collection(db, 'sites'), where('subdominio', '==', subdominio));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const d = querySnapshot.docs[0];
          found = { id: d.id, ...d.data() };
        }
      } catch (err) {
        console.warn('Firebase query falhou. Procurando no suporte local.', err);
      }

      if (!found) {
        try {
          const localListStr = localStorage.getItem('local_sites_list');
          if (localListStr) {
            const list = JSON.parse(localListStr);
            found = list.find(s => s.subdominio === subdominio || s.id === subdominio);
          }
        } catch (e) {}
      }

      if (!found) {
        found = DEMO_PORTFOLIOS.find(s => s.subdominio === subdominio || s.id === subdominio);
      }

      if (found) {
        setPortfolio(found);
      } else {
        setError('Portfólio não encontrado.');
        setPortfolio(null);
      }
      setLoading(false);
    };

    if (subdominio) {
      fetchPortfolio();
    }
  }, [subdominio]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando portfólio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Portfólio não encontrado</h2>
          <p className="text-gray-600">{error || 'O portfólio que você procurou não existe.'}</p>
          <button
            onClick={() => navigate('/galeria')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Voltar para a galeria
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de navegação discreta no topo */}
      <div className="bg-white/90 backdrop-blur shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <button
          onClick={() => navigate('/galeria')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          ← Galeria
        </button>
        <span className="text-xs text-gray-400">{portfolio.subdominio}.meusiteja.com</span>
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700 text-sm transition"
        >
          🏠 Início
        </button>
      </div>

      {/* Portfólio renderizado com o template correto */}
      <TemplateRenderer data={portfolio} />
    </div>
  );
}

export default PortfolioPublico;