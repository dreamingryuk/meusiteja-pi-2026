import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, collection, query, where, getDocs } from '../config/firebase';

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
      try {
        const q = query(collection(db, 'sites'), where('subdominio', '==', subdominio));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setError('Portfólio não encontrado.');
          setPortfolio(null);
        } else {
          const doc = querySnapshot.docs[0];
          setPortfolio({ id: doc.id, ...doc.data() });
        }
      } catch (err) {
        console.error('Erro ao buscar portfólio:', err);
        setError('Erro ao carregar o portfólio.');
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

  return <PublicPreviewView data={portfolio} />;
}

function PublicPreviewView({ data }) {
  const navigate = useNavigate();
  const primaryColor = data.cor_primaria || '#3B82F6';
  const secondaryColor = data.cor_secundaria || '#1E40AF';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botões de navegação */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/galeria')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            ← Voltar para a galeria
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            🏠 Início
          </button>
        </div>

        {/* Template do Portfólio (mesmo layout do Preview) */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div style={{ backgroundColor: primaryColor }} className="px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
              {data.foto ? (
                <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-4xl text-gray-500">👤</div>
              )}
            </div>
            <div className="text-white text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold capitalize">{data.nome || 'Seu Nome'}</h1>
              <p className="text-lg md:text-xl capitalize">{data.titulo || 'Seu Título'}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <section className="bg-gray-50 p-4 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ color: primaryColor }}>Sobre mim</h2>
              <p className="text-gray-700 leading-relaxed capitalize">{data.sobre || 'Nenhuma descrição fornecida.'}</p>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Missão</h3>
                <p className="text-gray-700 leading-relaxed capitalize">{data.missao || 'Não informado.'}</p>
              </section>
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Valores</h3>
                <p className="text-gray-700 leading-relaxed capitalize">{data.valores || 'Não informado.'}</p>
              </section>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Experiência</h3>
                <div className="text-gray-700">
                  <p className="font-medium capitalize">{data.empresa || 'Empresa'}</p>
                  <p className="capitalize">{data.cargo || 'Cargo'}</p>
                  <p className="text-sm text-gray-600 capitalize">{data.descricao_exp || ''}</p>
                </div>
              </section>
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Formação</h3>
                <div className="text-gray-700">
                  <p className="font-medium capitalize">{data.instituicao || 'Instituição'}</p>
                  <p className="capitalize">{data.curso || 'Curso'}</p>
                  <p className="text-sm text-gray-600">{data.ano || ''}</p>
                </div>
              </section>
            </div>

            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {data.tecnicas && data.tecnicas.split(',').map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">{skill.trim()}</span>
                ))}
                {data.pessoais && data.pessoais.split(',').map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">{skill.trim()}</span>
                ))}
              </div>
            </section>

            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Contato</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <p>📧 {data.email || 'Não informado'}</p>
                <p>📱 {data.telefone || 'Não informado'}</p>
                <p>📷 {data.instagram || 'Não informado'}</p>
                <p>💼 {data.linkedin || 'Não informado'}</p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-4 text-sm text-gray-600">
              <p>🔗 {data.subdominio || 'meusite'}.meusite.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioPublico;