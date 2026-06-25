// src/pages/Preview.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, doc, setDoc, deleteDoc } from '../config/firebase';
import { improveText } from '../services/groqService';

function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: initialData, uid } = location.state || { data: {}, uid: null };

  const [editData, setEditData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [improving, setImproving] = useState(false);

  // Melhorar textos com IA ao carregar
  useEffect(() => {
    const improveAllTexts = async () => {
      setImproving(true);
      const fieldsToImprove = ['sobre', 'missao', 'valores', 'descricao', 'descricao_exp'];
      const improved = { ...editData };
      
      for (const field of fieldsToImprove) {
        if (editData[field] && editData[field].length > 10) {
          const improvedText = await improveText(editData[field], field);
          improved[field] = improvedText;
        }
      }
      setEditData(improved);
      setImproving(false);
    };
    
    if (editData) improveAllTexts();
  }, []);

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handlePublish = async () => {
    if (!uid) {
      alert('Usuário não autenticado.');
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'sites', uid), editData);
      setIsPublished(true);
    } catch (error) {
      alert('Erro ao publicar: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este site? Esta ação é irreversível.')) return;
    try {
      await deleteDoc(doc(db, 'sites', uid));
      alert('Site excluído com sucesso.');
      navigate('/criar');
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  if (isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Site publicado!</h2>
          <p className="text-gray-600">Seu portfólio está no ar em: <br />
            <a href="#" className="text-blue-500 underline">
              {editData.subdominio}.meusite.com
            </a>
          </p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!editData) {
    return <div>Carregando...</div>;
  }

  const primaryColor = editData.cor_primaria || '#3B82F6';
  const secondaryColor = editData.cor_secundaria || '#1E40AF';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {improving && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg mb-4 text-center">
            ✨ Melhorando seus textos com IA...
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end mb-6">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            {isEditing ? '🔒 Visualizar' : '✏️ Editar'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {isSaving ? 'Publicando...' : '🚀 Publicar Site'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            🗑️ Excluir Site
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            🏠 Início
          </button>
        </div>

        {/* Aqui vai o template de visualização do portfólio (igual ao anterior) */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative" style={{ backgroundColor: primaryColor }}>
            <div className="px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                {editData.foto ? (
                  <img src={editData.foto} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-4xl text-gray-500">👤</div>
                )}
              </div>
              <div className="text-white text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.nome || ''}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-white/30 focus:border-white outline-none w-full"
                    placeholder="Seu nome"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold capitalize">{editData.nome || 'Seu Nome'}</h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.titulo || ''}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    className="text-lg md:text-xl bg-transparent border-b-2 border-white/30 focus:border-white outline-none w-full mt-1"
                    placeholder="Seu título"
                  />
                ) : (
                  <p className="text-lg md:text-xl capitalize">{editData.titulo || 'Seu Título'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* ... resto do conteúdo (igual ao Preview anterior) */}
            <section className="bg-gray-50 p-4 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ color: primaryColor }}>Sobre mim</h2>
              {isEditing ? (
                <textarea
                  value={editData.sobre || ''}
                  onChange={(e) => handleChange('sobre', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                  rows="4"
                  placeholder="Descreva-se..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed capitalize">{editData.sobre || 'Nenhuma descrição fornecida.'}</p>
              )}
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Missão</h3>
                {isEditing ? (
                  <textarea
                    value={editData.missao || ''}
                    onChange={(e) => handleChange('missao', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                    rows="2"
                    placeholder="Sua missão..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed capitalize">{editData.missao || 'Não informado.'}</p>
                )}
              </section>
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Valores</h3>
                {isEditing ? (
                  <textarea
                    value={editData.valores || ''}
                    onChange={(e) => handleChange('valores', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                    rows="2"
                    placeholder="Seus valores..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed capitalize">{editData.valores || 'Não informado.'}</p>
                )}
              </section>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Experiência</h3>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editData.empresa || ''}
                      onChange={(e) => handleChange('empresa', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Empresa"
                    />
                    <input
                      type="text"
                      value={editData.cargo || ''}
                      onChange={(e) => handleChange('cargo', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Cargo"
                    />
                    <textarea
                      value={editData.descricao_exp || ''}
                      onChange={(e) => handleChange('descricao_exp', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                      rows="2"
                      placeholder="Descrição"
                    />
                  </>
                ) : (
                  <div className="text-gray-700">
                    <p className="font-medium capitalize">{editData.empresa || 'Empresa'}</p>
                    <p className="capitalize">{editData.cargo || 'Cargo'}</p>
                    <p className="text-sm text-gray-600 capitalize">{editData.descricao_exp || ''}</p>
                  </div>
                )}
              </section>
              <section className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Formação</h3>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editData.instituicao || ''}
                      onChange={(e) => handleChange('instituicao', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Instituição"
                    />
                    <input
                      type="text"
                      value={editData.curso || ''}
                      onChange={(e) => handleChange('curso', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Curso"
                    />
                    <input
                      type="text"
                      value={editData.ano || ''}
                      onChange={(e) => handleChange('ano', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Ano"
                    />
                  </>
                ) : (
                  <div className="text-gray-700">
                    <p className="font-medium capitalize">{editData.instituicao || 'Instituição'}</p>
                    <p className="capitalize">{editData.curso || 'Curso'}</p>
                    <p className="text-sm text-gray-600">{editData.ano || ''}</p>
                  </div>
                )}
              </section>
            </div>

            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Habilidades</h3>
              {isEditing ? (
                <>
                  <label className="block text-sm text-gray-600">Técnicas</label>
                  <input
                    type="text"
                    value={editData.tecnicas || ''}
                    onChange={(e) => handleChange('tecnicas', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="JavaScript, React, Python"
                  />
                  <label className="block text-sm text-gray-600">Interpessoais</label>
                  <input
                    type="text"
                    value={editData.pessoais || ''}
                    onChange={(e) => handleChange('pessoais', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Comunicação, Liderança"
                  />
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editData.tecnicas && editData.tecnicas.split(',').map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">{skill.trim()}</span>
                  ))}
                  {editData.pessoais && editData.pessoais.split(',').map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">{skill.trim()}</span>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Contato</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={editData.telefone || ''}
                      onChange={(e) => handleChange('telefone', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Telefone"
                    />
                    <input
                      type="text"
                      value={editData.instagram || ''}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Instagram"
                    />
                    <input
                      type="text"
                      value={editData.linkedin || ''}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="LinkedIn"
                    />
                  </>
                ) : (
                  <>
                    <p>📧 {editData.email || 'Não informado'}</p>
                    <p>📱 {editData.telefone || 'Não informado'}</p>
                    <p>📷 {editData.instagram || 'Não informado'}</p>
                    <p>💼 {editData.linkedin || 'Não informado'}</p>
                  </>
                )}
              </div>
            </section>

            <section className="border-t border-gray-200 pt-4 text-sm text-gray-600">
              <p>🔗 {editData.subdominio || 'meusite'}.meusite.com</p>
            </section>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ✨ Clique em "Editar" para alterar qualquer campo. As alterações são salvas ao publicar.
        </p>
      </div>
    </div>
  );
}

export default Preview;