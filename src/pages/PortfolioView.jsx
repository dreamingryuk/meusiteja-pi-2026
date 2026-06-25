// src/pages/PortfolioView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc } from '../config/firebase';

function PortfolioView() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const docRef = doc(db, 'sites', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPortfolio(docSnap.data());
        } else {
          setPortfolio(null);
        }
      } catch (error) {
        console.error('Erro ao buscar portfolio:', error);
      }
      setLoading(false);
    };
    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">Portfólio não encontrado</h2>
          <Link to="/galeria" className="mt-4 inline-block text-blue-600 hover:underline">
            Ver outros portfolios
          </Link>
        </div>
      </div>
    );
  }

  const primaryColor = portfolio.cor_primaria || '#3B82F6';
  const secondaryColor = portfolio.cor_secundaria || '#1E40AF';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/galeria" className="inline-block mb-6 text-blue-600 hover:underline">
          ← Voltar para galeria
        </Link>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div style={{ backgroundColor: primaryColor }} className="px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
              {portfolio.foto ? (
                <img src={portfolio.foto} alt={portfolio.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-4xl text-gray-500">👤</div>
              )}
            </div>
            <div className="text-white text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold capitalize">{portfolio.nome || 'Anônimo'}</h1>
              <p className="text-lg md:text-xl capitalize">{portfolio.titulo || ''}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Sobre */}
            <section className="bg-gray-50 p-4 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ color: primaryColor }}>Sobre mim</h2>
              <p className="text-gray-700 leading-relaxed capitalize">{portfolio.sobre || 'Não informado'}</p>
            </section>

            {/* Missão e Valores */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Missão</h3>
                <p className="text-gray-700 leading-relaxed capitalize">{portfolio.missao || 'Não informado'}</p>
              </section>
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Valores</h3>
                <p className="text-gray-700 leading-relaxed capitalize">{portfolio.valores || 'Não informado'}</p>
              </section>
            </div>

            {/* Experiência e Formação */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Experiência</h3>
                <p className="font-medium capitalize">{portfolio.empresa || 'Empresa'}</p>
                <p className="capitalize">{portfolio.cargo || 'Cargo'}</p>
                <p className="text-sm text-gray-600 capitalize">{portfolio.descricao_exp || ''}</p>
              </section>
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Formação</h3>
                <p className="font-medium capitalize">{portfolio.instituicao || 'Instituição'}</p>
                <p className="capitalize">{portfolio.curso || 'Curso'}</p>
                <p className="text-sm text-gray-600">{portfolio.ano || ''}</p>
              </section>
            </div>

            {/* Habilidades */}
            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.tecnicas && portfolio.tecnicas.split(',').map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">{skill.trim()}</span>
                ))}
                {portfolio.pessoais && portfolio.pessoais.split(',').map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">{skill.trim()}</span>
                ))}
              </div>
            </section>

            {/* Contato */}
            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Contato</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <p>📧 {portfolio.email || 'Não informado'}</p>
                <p>📱 {portfolio.telefone || 'Não informado'}</p>
                <p>📷 {portfolio.instagram || 'Não informado'}</p>
                <p>💼 {portfolio.linkedin || 'Não informado'}</p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-4 text-sm text-gray-600">
              <p>🔗 {portfolio.subdominio || 'meusite'}.meusite.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioView;