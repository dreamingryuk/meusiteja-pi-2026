import React, { useState } from 'react';

function EscolhaTemplate({ onNext, onBack, data = {} }) {
  const [selectedTemplate, setSelectedTemplate] = useState(data.template || 'tech');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) {
      onNext({ template: selectedTemplate });
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

              {/* Selection indicator */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
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
    </form>
  );
}

export default EscolhaTemplate;
