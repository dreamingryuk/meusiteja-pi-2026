import React, { useState } from 'react';
import TemplateRenderer from './templates/TemplateRenderer';

// Dados usados para preencher os campos que o usuário ainda não preencheu,
// só para a pré-visualização ficar completa e realista.
const PREVIEW_FALLBACK = {
  nome: 'Seu Nome Aqui',
  titulo: 'Seu Título Profissional',
  descricao: 'Uma frase curta e marcante sobre o que você faz.',
  sobre: 'Aqui aparece o texto "Sobre mim" que você escreveu, contando sua trajetória e o que te diferencia profissionalmente.',
  experiencias: [
    { empresa: 'Nome da Empresa', cargo: 'Seu Cargo', descricao: 'Uma breve descrição do que você fez nessa experiência.' }
  ],
  educacoes: [
    { instituicao: 'Sua Instituição de Ensino', curso: 'Seu Curso', ano: '2024' }
  ],
  tecnicas: 'Habilidade 1, Habilidade 2, Habilidade 3',
  pessoais: 'Comunicação, Organização',
  email: 'voce@email.com',
  telefone: '(00) 90000-0000',
  instagram: '@seuinstagram',
  linkedin: 'linkedin.com/in/voce',
  subdominio: 'seu-link'
};

function EscolhaTemplate({ onNext, onBack, data = {} }) {
  const [selectedTemplate, setSelectedTemplate] = useState(data.template || 'tech');
  const [previewTemplateId, setPreviewTemplateId] = useState(null);

  // Formalização por IA: ativada por padrão. Só é possível existir como
  // `false` se o usuário já tiver desativado antes (ex: voltando um passo).
  const [iaAtiva, setIaAtiva] = useState(data.iaFormalizacaoAtiva !== false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const templates = [
    {
      id: 'tech',
      nome: 'Tech & Inovação',
      tagline: 'Ideal para devs, engenheiros e profissionais de TI',
      icone: '💻',
      badge: 'Popular',
      corGradiente: 'from-blue-600 to-indigo-700',
      corCard: 'border-blue-500 bg-blue-50/50'
    },
    {
      id: 'minimalista',
      nome: 'Minimalista & Clean',
      tagline: 'Foco total no conteúdo com visual limpo e elegante',
      icone: '✨',
      badge: 'Clean',
      corGradiente: 'from-slate-700 to-slate-900',
      corCard: 'border-slate-500 bg-slate-50/50'
    },
    {
      id: 'criativo',
      nome: 'Criativo & Design',
      tagline: 'Vibrante e dinâmico para designers e artistas',
      icone: '🎨',
      badge: 'Destaque',
      corGradiente: 'from-purple-600 to-pink-600',
      corCard: 'border-purple-500 bg-purple-50/50'
    },
    {
      id: 'executivo',
      nome: 'Executivo & Negócios',
      tagline: 'Sofisticado para consultores, gestores e corporativo',
      icone: '📊',
      badge: 'Corporativo',
      corGradiente: 'from-gray-800 to-blue-900',
      corCard: 'border-gray-700 bg-gray-50/50'
    },
    {
      id: 'saude',
      nome: 'Saúde & Bem-Estar',
      tagline: 'Harmonioso para médicos, terapeutas e psicólogos',
      icone: '🩺',
      badge: 'Confiança',
      corGradiente: 'from-emerald-600 to-teal-700',
      corCard: 'border-emerald-500 bg-emerald-50/50'
    },
    {
      id: 'juridico',
      nome: 'Jurídico & Direito',
      tagline: 'Sério e sóbrio para advogados e consultores jurídicos',
      icone: '⚖️',
      badge: 'Tradicional',
      corGradiente: 'from-amber-800 to-stone-900',
      corCard: 'border-amber-700 bg-amber-50/50'
    },
    {
      id: 'academico',
      nome: 'Acadêmico & Pesquisa',
      tagline: 'Estruturado para professores, pesquisadores e estudantes',
      icone: '🎓',
      badge: 'Científico',
      corGradiente: 'from-sky-700 to-blue-900',
      corCard: 'border-sky-600 bg-sky-50/50'
    },
    {
      id: 'beleza',
      nome: 'Beleza & Estética',
      tagline: 'Delicado e moderno para maquiadores, esteticistas e moda',
      icone: '💅',
      badge: 'Estilo',
      corGradiente: 'from-rose-500 to-pink-500',
      corCard: 'border-rose-400 bg-rose-50/50'
    },
    {
      id: 'jovem',
      nome: 'Jovem & Moderno',
      tagline: 'Casual e dinâmico para estudantes e primeiros empregos',
      icone: '🚀',
      badge: 'Despojado',
      corGradiente: 'from-orange-500 to-amber-500',
      corCard: 'border-orange-500 bg-orange-50/50'
    }
  ];

  // Mescla os dados reais que o usuário já preencheu nos passos anteriores
  // com valores de exemplo nos campos ainda vazios, para a prévia nunca
  // aparecer "quebrada" ou incompleta.
  const buildPreviewData = (templateId) => ({
    ...PREVIEW_FALLBACK,
    ...data,
    nome: data.nome || PREVIEW_FALLBACK.nome,
    titulo: data.titulo || PREVIEW_FALLBACK.titulo,
    descricao: data.descricao || PREVIEW_FALLBACK.descricao,
    sobre: data.sobre || PREVIEW_FALLBACK.sobre,
    experiencias: data.experiencias?.length ? data.experiencias : PREVIEW_FALLBACK.experiencias,
    educacoes: data.educacoes?.length ? data.educacoes : PREVIEW_FALLBACK.educacoes,
    tecnicas: data.tecnicas || PREVIEW_FALLBACK.tecnicas,
    pessoais: data.pessoais || PREVIEW_FALLBACK.pessoais,
    template: templateId
  });

  const openPreview = (e, templateId) => {
    e.stopPropagation();
    setPreviewTemplateId(templateId);
  };

  const closePreview = () => setPreviewTemplateId(null);

  const chooseFromPreview = () => {
    setSelectedTemplate(previewTemplateId);
    setPreviewTemplateId(null);
  };

  // Ao tentar DESATIVAR a formalização, exige confirmação via popup.
  // Reativar (antes de publicar) não precisa de confirmação.
  const handleToggleIa = (checked) => {
    if (checked) {
      setIaAtiva(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const confirmDisableIa = () => {
    setIaAtiva(false);
    setShowConfirmModal(false);
  };

  const cancelDisableIa = () => {
    setShowConfirmModal(false); // checkbox permanece marcada
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) {
      onNext({ template: selectedTemplate, iaFormalizacaoAtiva: iaAtiva });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-800">Escolha o seu Template</h2>
        <p className="text-gray-500 text-sm mt-1">
          Selecione o modelo visual que melhor combina com a sua profissão e estilo
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">
        {templates.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-400/30'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Top bar styling / badge */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${tmpl.corGradiente} text-white shadow-sm`}>
                  {tmpl.icone}
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tmpl.badge}
                </span>
              </div>

              {/* Title & info */}
              <div>
                <h3 className="font-bold text-gray-800 text-base leading-snug">
                  {tmpl.nome}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {tmpl.tagline}
                </p>
              </div>

              {/* Botão de pré-visualização */}
              <button
                type="button"
                onClick={(e) => openPreview(e, tmpl.id)}
                className="mt-3 w-full text-xs font-medium py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Pré-visualizar
              </button>

              {/* Selection indicator */}
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
                <span className={isSelected ? 'font-bold text-blue-600' : 'text-gray-400'}>
                  {isSelected ? '✓ Selecionado' : 'Clique para selecionar'}
                </span>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== Controle de formalização por IA ===== */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={iaAtiva}
            onChange={(e) => handleToggleIa(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm">
            <span className="font-medium text-gray-800">Formalizar textos automaticamente com IA</span>
            <span className="block text-gray-500 text-xs mt-0.5">
              Ativado por padrão. A IA revisa e melhora a descrição, o "sobre mim" e as
              descrições de experiência antes de publicar seu site.
            </span>
          </span>
        </label>
        {!iaAtiva && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
            ⚠ Formalização por IA desativada. Seus textos serão publicados exatamente como
            você escreveu. Depois de publicado, para usar a IA você precisará criar um novo portfólio.
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Voltar
          </button>
        )}
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow"
        >
          Continuar
        </button>
      </div>

      {/* ===== Modal de pré-visualização do template ===== */}
      {previewTemplateId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closePreview}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-bold text-gray-800">
                Pré-visualização — {templates.find(t => t.id === previewTemplateId)?.nome}
              </h3>
              <button
                type="button"
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 bg-gray-100">
              <TemplateRenderer data={buildPreviewData(previewTemplateId)} />
            </div>

            <div className="flex gap-3 px-5 py-3 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={closePreview}
                className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={chooseFromPreview}
                className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Usar este template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Popup de confirmação ao desativar a IA ===== */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={cancelDisableIa}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Desativar formalização por IA?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Seus textos serão publicados exatamente como você escreveu, sem revisão da IA.
              Se mudar de ideia depois de publicar o site, será necessário criar um novo
              portfólio para usar a IA novamente.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDisableIa}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDisableIa}
                className="flex-1 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition"
              >
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default EscolhaTemplate;
