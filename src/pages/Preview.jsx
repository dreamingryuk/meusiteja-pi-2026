import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, doc, setDoc, deleteDoc } from '../config/firebase';
import TemplateRenderer from '../components/templates/TemplateRenderer';

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
  const { data: initialData, uid, isPublicView = false } = location.state || { data: null, uid: null, isPublicView: false };

  const [editData, setEditData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const fileInputRef = useRef(null);

  // Redireciona se acessado diretamente sem dados
  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum portfólio carregado</h2>
          <p className="text-gray-500 mb-6">Para visualizar o preview, crie seu portfólio pelo formulário.</p>
          <button
            onClick={() => navigate('/criar')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium"
          >
            🚀 Criar meu portfólio
          </button>
          <button
            onClick={() => navigate('/')}
            className="ml-3 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            🏠 Início
          </button>
        </div>
      </div>
    );
  }

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
    const siteData = { ...editData, uid, updatedAt: new Date().toISOString() };

    // Tenta salvar no Firebase
    try {
      await setDoc(doc(db, 'sites', uid), siteData);
    } catch (error) {
      console.warn('Firebase setDoc falhou. Salvando no localStorage em modo de teste.', error);
    }

    // Salva sempre no localStorage para suporte offline/modo de teste
    try {
      localStorage.setItem('site_' + uid, JSON.stringify(siteData));
      const existingListStr = localStorage.getItem('local_sites_list') || '[]';
      const existingList = JSON.parse(existingListStr);
      const filtered = existingList.filter(s => s.uid !== uid && s.subdominio !== siteData.subdominio);
      filtered.push(siteData);
      localStorage.setItem('local_sites_list', JSON.stringify(filtered));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }

    setIsPublished(true);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este site?')) return;
    try {
      await deleteDoc(doc(db, 'sites', uid));
    } catch (error) {
      console.warn('Firebase deleteDoc falhou. Deletando do localStorage.', error);
    }

    try {
      localStorage.removeItem('site_' + uid);
      const existingListStr = localStorage.getItem('local_sites_list') || '[]';
      const existingList = JSON.parse(existingListStr);
      const filtered = existingList.filter(s => s.uid !== uid);
      localStorage.setItem('local_sites_list', JSON.stringify(filtered));
    } catch (e) {}

    alert('Site excluído com sucesso.');
    navigate('/');
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

  const showEditButtons = !isPublicView && uid;

  return (
    <div className="min-h-screen bg-gray-200 py-6 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Barra de ações (edição/publicação) */}
        {showEditButtons && (
          <div className="flex flex-wrap gap-3 justify-end mb-4 bg-white/80 backdrop-blur px-4 py-3 rounded-2xl shadow-sm">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
            >
              {isEditing ? '🔒 Fechar edição' : '✏️ Editar dados'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 text-sm"
            >
              {isSaving ? 'Publicando...' : '🚀 Publicar Site'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              🗑️ Excluir
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              🏠 Início
            </button>
          </div>
        )}

        {isPublicView && (
          <div className="flex justify-between items-center mb-4">
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

        {/* Painel de edição inline (abre quando clica em "Editar dados") */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">✏️ Editar dados do portfólio</h3>

            {/* Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
              <div className="flex items-center gap-3">
                {editData.foto && (
                  <img src={editData.foto} alt="Foto atual" className="w-14 h-14 rounded-full object-cover border" />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  📷 Trocar foto
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </div>
            </div>

            {/* Nome e título */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" value={editData.nome || ''} onChange={(e) => handleChange('nome', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título profissional</label>
                <input type="text" value={editData.titulo || ''} onChange={(e) => handleChange('titulo', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Desenvolvedor Fullstack" />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição breve</label>
              <input type="text" value={editData.descricao || ''} onChange={(e) => handleChange('descricao', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Frase de apresentação" />
            </div>

            {/* Sobre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sobre mim</label>
              <textarea value={editData.sobre || ''} onChange={(e) => handleChange('sobre', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-y" rows="3" />
            </div>

            {/* Habilidades */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades técnicas</label>
                <input type="text" value={editData.tecnicas || ''} onChange={(e) => handleChange('tecnicas', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="React, Python, SQL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades interpessoais</label>
                <input type="text" value={editData.pessoais || ''} onChange={(e) => handleChange('pessoais', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Comunicação, Liderança" />
              </div>
            </div>

            {/* Contato */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={editData.email || ''} onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" value={editData.telefone || ''} onChange={(e) => handleChange('telefone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input type="text" value={editData.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input type="text" value={editData.linkedin || ''} onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Experiências */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experiências</label>
              <div className="space-y-3">
                {(editData.experiencias || []).map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    <input type="text" value={exp.empresa || ''} onChange={(e) => handleNestedChange('experiencias', index, 'empresa', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Empresa" />
                    <input type="text" value={exp.cargo || ''} onChange={(e) => handleNestedChange('experiencias', index, 'cargo', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cargo" />
                    <textarea value={exp.descricao || ''} onChange={(e) => handleNestedChange('experiencias', index, 'descricao', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y" rows="2" placeholder="Descrição" />
                    <button type="button" onClick={() => setEditData({ ...editData, experiencias: editData.experiencias.filter((_, i) => i !== index) })}
                      className="text-red-500 text-xs hover:text-red-700">Remover</button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => setEditData({ ...editData, experiencias: [...(editData.experiencias || []), { empresa: '', cargo: '', descricao: '' }] })}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                  + Adicionar experiência
                </button>
              </div>
            </div>

            {/* Formação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formação</label>
              <div className="space-y-3">
                {(editData.educacoes || []).map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    <input type="text" value={edu.instituicao || ''} onChange={(e) => handleNestedChange('educacoes', index, 'instituicao', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Instituição" />
                    <input type="text" value={edu.curso || ''} onChange={(e) => handleNestedChange('educacoes', index, 'curso', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Curso" />
                    <input type="text" value={edu.ano || ''} onChange={(e) => handleNestedChange('educacoes', index, 'ano', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ano" />
                    <button type="button" onClick={() => setEditData({ ...editData, educacoes: editData.educacoes.filter((_, i) => i !== index) })}
                      className="text-red-500 text-xs hover:text-red-700">Remover</button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => setEditData({ ...editData, educacoes: [...(editData.educacoes || []), { instituicao: '', curso: '', ano: '' }] })}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                  + Adicionar formação
                </button>
              </div>
            </div>

            {/* Cores */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor primária</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={editData.cor_primaria || '#3B82F6'} onChange={(e) => handleChange('cor_primaria', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0" />
                  <span className="text-sm text-gray-500">{editData.cor_primaria || '#3B82F6'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor secundária</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={editData.cor_secundaria || '#1E40AF'} onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0" />
                  <span className="text-sm text-gray-500">{editData.cor_secundaria || '#1E40AF'}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 pt-2">✨ As alterações são salvas ao clicar em "Publicar Site".</p>
          </div>
        )}

        {/* Preview com o template selecionado */}
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <TemplateRenderer data={editData} />
        </div>
      </div>
    </div>
  );
}

export default Preview;