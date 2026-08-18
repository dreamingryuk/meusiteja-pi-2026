import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, doc, setDoc, deleteDoc } from '../config/firebase';

// Função de compressão (idêntica à do componente Foto)
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: initialData, uid, isPublicView = false } = location.state || { data: {}, uid: null, isPublicView: false };

  const [editData, setEditData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleNestedChange = (type, index, field, value) => {
    const updated = [...editData[type]];
    updated[index] = { ...updated[index], [field]: value };
    setEditData({ ...editData, [type]: updated });
  };

  // Upload de foto com compressão (sem Firebase Storage)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.7);
      setEditData({ ...editData, foto: compressed });
    } catch (error) {
      alert('Erro ao processar imagem: ' + error.message);
    }
  };

  const handlePublish = async () => {
    if (!uid) {
      alert('Usuário não autenticado.');
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'sites', uid), { ...editData, uid });
      setIsPublished(true);
    } catch (error) {
      alert('Erro ao publicar: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este site?')) return;
    try {
      await deleteDoc(doc(db, 'sites', uid));
      alert('Site excluído com sucesso.');
      navigate('/');
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
            <a href={`/portfolio/${editData.subdominio}`} className="text-blue-500 underline">
              /portfolio/{editData.subdominio}
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
    return <div className="text-center py-12">Carregando...</div>;
  }

  const primaryColor = editData.cor_primaria || '#3B82F6';
  const secondaryColor = editData.cor_secundaria || '#1E40AF';
  const showEditButtons = !isPublicView && uid;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {showEditButtons && (
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
        )}

        {isPublicView && (
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
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Banner colorido com edição de paleta */}
          <div style={{ backgroundColor: primaryColor }} className="px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-6 relative">
            {isEditing && (
              <button
                className="absolute top-3 right-3 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition z-10"
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Editar cores"
              >
                🎨
              </button>
            )}
            {showColorPicker && isEditing && (
              <div className="absolute top-14 right-3 bg-white p-3 rounded-lg shadow-lg flex gap-3 z-20">
                <div>
                  <label className="block text-xs text-gray-600">Primária</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setEditData({ ...editData, cor_primaria: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Secundária</label>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setEditData({ ...editData, cor_secundaria: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0 relative">
              {editData.foto ? (
                <img src={editData.foto} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-4xl text-gray-500">👤</div>
              )}
              {isEditing && (
                <div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <span className="text-white text-3xl">📷</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>

            <div className="text-white text-center md:text-left flex-1">
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
              {/* Descrição breve */}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.descricao || ''}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  className="text-md md:text-lg bg-transparent border-b-2 border-white/30 focus:border-white outline-none w-full mt-1"
                  placeholder="Descrição breve"
                />
              ) : (
                editData.descricao && <p className="text-md md:text-lg text-white/90">{editData.descricao}</p>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Sobre */}
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
                <p className="text-gray-700 leading-relaxed">{editData.sobre || 'Nenhuma descrição fornecida.'}</p>
              )}
            </section>

            {/* Experiência */}
            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Experiência</h3>
              {isEditing ? (
                <div>
                  {editData.experiencias && editData.experiencias.map((exp, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 mb-3">
                      <input
                        type="text"
                        value={exp.empresa || ''}
                        onChange={(e) => handleNestedChange('experiencias', index, 'empresa', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Empresa"
                      />
                      <input
                        type="text"
                        value={exp.cargo || ''}
                        onChange={(e) => handleNestedChange('experiencias', index, 'cargo', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Cargo"
                      />
                      <textarea
                        value={exp.descricao || ''}
                        onChange={(e) => handleNestedChange('experiencias', index, 'descricao', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                        rows="2"
                        placeholder="Descrição"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editData.experiencias.filter((_, i) => i !== index);
                          setEditData({ ...editData, experiencias: updated });
                        }}
                        className="text-red-500 text-sm hover:text-red-700 mt-1"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(editData.experiencias || []), { empresa: '', cargo: '', descricao: '' }];
                      setEditData({ ...editData, experiencias: updated });
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Adicionar experiência
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {editData.experiencias && editData.experiencias.length > 0 ? (
                    editData.experiencias.map((exp, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-2">
                        <p className="font-medium capitalize">{exp.empresa}</p>
                        <p className="capitalize">{exp.cargo}</p>
                        {exp.descricao && <p className="text-sm text-gray-600">{exp.descricao}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhuma experiência adicionada.</p>
                  )}
                </div>
              )}
            </section>

            {/* Formação */}
            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Formação</h3>
              {isEditing ? (
                <div>
                  {editData.educacoes && editData.educacoes.map((edu, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 mb-3">
                      <input
                        type="text"
                        value={edu.instituicao || ''}
                        onChange={(e) => handleNestedChange('educacoes', index, 'instituicao', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Instituição"
                      />
                      <input
                        type="text"
                        value={edu.curso || ''}
                        onChange={(e) => handleNestedChange('educacoes', index, 'curso', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Curso"
                      />
                      <input
                        type="text"
                        value={edu.ano || ''}
                        onChange={(e) => handleNestedChange('educacoes', index, 'ano', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Ano"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editData.educacoes.filter((_, i) => i !== index);
                          setEditData({ ...editData, educacoes: updated });
                        }}
                        className="text-red-500 text-sm hover:text-red-700 mt-1"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(editData.educacoes || []), { instituicao: '', curso: '', ano: '' }];
                      setEditData({ ...editData, educacoes: updated });
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Adicionar formação
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {editData.educacoes && editData.educacoes.length > 0 ? (
                    editData.educacoes.map((edu, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-2">
                        <p className="font-medium capitalize">{edu.instituicao}</p>
                        <p className="capitalize">{edu.curso}</p>
                        {edu.ano && <p className="text-sm text-gray-600">{edu.ano}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhuma formação adicionada.</p>
                  )}
                </div>
              )}
            </section>

            {/* Habilidades */}
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

            {/* Contato */}
            <section className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: secondaryColor }}>Contato</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                {isEditing ? (
                  <>
                    <input type="email" value={editData.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Email" />
                    <input type="tel" value={editData.telefone || ''} onChange={(e) => handleChange('telefone', e.target.value)} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Telefone" />
                    <input type="text" value={editData.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Instagram" />
                    <input type="text" value={editData.linkedin || ''} onChange={(e) => handleChange('linkedin', e.target.value)} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="LinkedIn" />
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
              <p>🔗 /portfolio/{editData.subdominio || 'meusite'}</p>
            </section>
          </div>
        </div>

        {!isPublicView && (
          <p className="text-center text-xs text-gray-400 mt-6">
            ✨ Clique em "Editar" para alterar qualquer campo. As alterações são salvas ao publicar.
          </p>
        )}
      </div>
    </div>
  );
}

export default Preview;