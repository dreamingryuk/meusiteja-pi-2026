import React from 'react';

/**
 * Selo/aviso para indicar que o conteúdo deste campo passará pela
 * formalização automática da IA (a menos que o usuário desative essa opção
 * na etapa "Escolha seu template").
 */
function AIBadge({ text = 'Este campo será formalizado automaticamente pela IA' }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-2.5 py-1.5 mb-1.5">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 4.5a.5.5 0 01.5.5v1.5H11a.5.5 0 010 1H9.5V9a.5.5 0 01-1 0V7.5H7a.5.5 0 010-1h1.5V5a.5.5 0 01.5-.5zM15.5 11a.5.5 0 01.5.5v.75h.75a.5.5 0 010 1H16v.75a.5.5 0 01-1 0v-.75h-.75a.5.5 0 010-1H15v-.75a.5.5 0 01.5-.5z" />
        <path fillRule="evenodd" d="M6.5 2a1 1 0 01.98.804l.27 1.35a3.5 3.5 0 002.596 2.696l1.35.27a1 1 0 010 1.96l-1.35.27a3.5 3.5 0 00-2.696 2.596l-.27 1.35a1 1 0 01-1.96 0l-.27-1.35a3.5 3.5 0 00-2.596-2.696l-1.35-.27a1 1 0 010-1.96l1.35-.27A3.5 3.5 0 006.23 4.154l.27-1.35A1 1 0 016.5 2z" clipRule="evenodd" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

export default AIBadge;
