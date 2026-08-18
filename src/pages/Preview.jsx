import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db, doc, setDoc, deleteDoc } from '../config/firebase';
import TemplateRenderer from '../components/templates/TemplateRenderer';

// Função de compressão de imagem
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
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

        if (!ctx) {
          reject(new Error('Não foi possível processar a imagem.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Não foi possível carregar a imagem.'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Não foi possível ler o arquivo.'));
    };

    reader.readAsDataURL(file);
  });
};

function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: initialData,
    uid,
    isPublicView = false
  } = location.state || {
    data: null,
    uid: null,
    isPublicView: false
  };

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

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nenhum portfólio carregado
          </h2>

          <p className="text-gray-500 mb-6">
            Para visualizar o preview, crie seu portfólio pelo formulário.
          </p>

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
    setEditData((previousData) => ({
      ...previousData,
      [field]: value
    }));
  };

  const handleNestedChange = (type, index, field, value) => {
    const updated = [...(editData[type] || [])];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setEditData((previousData) => ({
      ...previousData,
      [type]: updated
    }));
  };

  // Upload de foto com compressão
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const compressed = await compressImage(file, 800, 0.7);

      setEditData((previousData) => ({
        ...previousData,
        foto: compressed
      }));
    } catch (error) {
      console.error('Erro ao processar imagem:', error);

      alert(
        'Erro ao processar imagem: ' +
        (error?.message || 'erro desconhecido')
      );
    }
  };

  // ============================================================
  // PUBLICAR SITE
  // ============================================================
  const handlePublish = async () => {
    /*
     * IMPORTANTE:
     * Não usamos mais o "uid" recebido pelo location.state.
     *
     * O UID correto é sempre o UID do Firebase Authentication.
     */
    const user = auth.currentUser;

    if (!user) {
      alert(
        'Sua sessão não está autenticada no Firebase.\n\n' +
        'Faça login novamente para publicar seu site.'
      );

      navigate('/criar');
      return;
    }

    const authenticatedUid = user.uid;

    setIsSaving(true);

    /*
     * O documento do Firestore terá o mesmo UID do usuário autenticado.
     *
     * Authentication UID:
     *     authenticatedUid
     *
     * Document ID:
     *     sites/authenticatedUid
     *
     * Campo uid:
     *     authenticatedUid
     */
    const siteData = {
      ...editData,
      uid: authenticatedUid,
      updatedAt: new Date().toISOString()
    };

    try {
      console.log('Publicando site...');
      console.log('Firebase Auth UID:', authenticatedUid);
      console.log('Firestore document:', `sites/${authenticatedUid}`);

      // Salva no Firestore
      await setDoc(
        doc(db, 'sites', authenticatedUid),
        siteData
      );

      console.log('Site salvo com sucesso no Firestore.');

      /*
       * O localStorage é apenas um cache local.
       * Ele NÃO substitui o Firestore.
       *
       * Só chegamos aqui depois que o Firestore confirmou
       * a gravação com sucesso.
       */
      try {
        localStorage.setItem(
          'site_' + authenticatedUid,
          JSON.stringify(siteData)
        );

        const existingListStr =
          localStorage.getItem('local_sites_list') || '[]';

        const existingList = JSON.parse(existingListStr);

        const filtered = existingList.filter(
          (site) =>
            site.uid !== authenticatedUid &&
            site.subdominio !== siteData.subdominio
        );

        filtered.push(siteData);

        localStorage.setItem(
          'local_sites_list',
          JSON.stringify(filtered)
        );
      } catch (localStorageError) {
        /*
         * Se o localStorage falhar, não é motivo para considerar
         * a publicação como falha, porque o Firestore já confirmou.
         */
        console.warn(
          'Firestore salvou corretamente, mas o localStorage falhou:',
          localStorageError
        );
      }

      // Só mostra "Site publicado" depois do setDoc funcionar.
      setIsPublished(true);

    } catch (error) {
      console.error('Erro ao publicar no Firestore:', error);

      let message =
        'Não foi possível publicar o site no Firebase.';

      if (error?.code === 'permission-denied') {
        message =
          'O Firebase recusou a gravação por falta de permissão.\n\n' +
          'Verifique se o usuário autenticado possui o mesmo UID ' +
          'usado no documento do Firestore.';
      } else if (error?.code === 'unauthenticated') {
        message =
          'Sua sessão do Firebase expirou. Faça login novamente.';
      } else if (error?.message) {
        message += '\n\nErro: ' + error.message;
      }

      alert(message);

      /*
       * IMPORTANTE:
       * Não definimos isPublished como true aqui.
       *
       * Se o Firestore rejeitar, o site NÃO é considerado publicado.
       */
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // EXCLUIR SITE
  // ============================================================
  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este site?')) {
      return;
    }

    /*
     * Também usamos o UID real do Authentication para excluir.
     */
    const user = auth.currentUser;

    if (!user) {
      alert(
        'Sua sessão não está autenticada no Firebase.\n\n' +
        'Faça login novamente.'
      );

      navigate('/criar');
      return;
    }

    const authenticatedUid = user.uid;

    try {
      console.log(
        'Excluindo documento:',
        `sites/${authenticatedUid}`
      );

      await deleteDoc(
        doc(db, 'sites', authenticatedUid)
      );

      console.log('Site excluído do Firestore.');

      // Limpa o cache local somente depois do Firestore confirmar.
      try {
        localStorage.removeItem(
          'site_' + authenticatedUid
        );

        const existingListStr =
          localStorage.getItem('local_sites_list') || '[]';

        const existingList = JSON.parse(existingListStr);

        const filtered = existingList.filter(
          (site) => site.uid !== authenticatedUid
        );

        localStorage.setItem(
          'local_sites_list',
          JSON.stringify(filtered)
        );
      } catch (localStorageError) {
        console.warn(
          'Erro ao limpar localStorage:',
          localStorageError
        );
      }

      alert('Site excluído com sucesso.');

      navigate('/');

    } catch (error) {
      console.error(
        'Erro ao excluir site do Firestore:',
        error
      );

      let message =
        'Não foi possível excluir o site.';

      if (error?.code === 'permission-denied') {
        message =
          'O Firebase recusou a exclusão por falta de permissão.';
      } else if (error?.code === 'unauthenticated') {
        message =
          'Sua sessão expirou. Faça login novamente.';
      } else if (error?.message) {
        message += '\n\nErro: ' + error.message;
      }

      alert(message);
    }
  };

  // ============================================================
  // TELA DE SUCESSO
  // ============================================================
  if (isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

          <div className="text-6xl mb-4">
            🎉
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Site publicado!
          </h2>

          <p className="text-gray-600">
            Seu portfólio está no ar em:
            <br />

            <a
              href={`/portfolio/${editData.subdominio}`}
              className="text-blue-500 underline"
            >
              /portfolio/{editData.subdominio}
            </a>
          </p>

          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  /*
   * Para mostrar os botões de edição/publicação,
   * ainda verificamos se existe um UID recebido.
   *
   * A publicação em si NÃO confia nesse UID.
   * handlePublish usa auth.currentUser.uid.
   */
  const showEditButtons =
    !isPublicView &&
    !!uid;

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
