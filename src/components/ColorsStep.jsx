import React, { useState } from 'react';

function ColorsStep({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    cor_primaria: data.cor_primaria || '#3B82F6',
    cor_secundaria: data.cor_secundaria || '#1E40AF'
  });

  const paletas = [
    { nome: 'Azul', primaria: '#3B82F6', secundaria: '#1E40AF' },
    { nome: 'Verde', primaria: '#10B981', secundaria: '#065F46' },
    { nome: 'Roxo', primaria: '#8B5CF6', secundaria: '#5B21B6' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Paleta de cores</h2>
      <p className="text-gray-500 text-sm -mt-2">Escolha as cores do seu site</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cores pré-definidas</label>
        <div className="flex gap-3 justify-center">
          {paletas.map((p) => (
            <button
              key={p.nome}
              type="button"
              onClick={() => setForm({ 
                cor_primaria: p.primaria, 
                cor_secundaria: p.secundaria 
              })}
              className={`w-20 p-2 rounded-lg border-2 transition ${
                form.cor_primaria === p.primaria 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex h-8 rounded overflow-hidden">
                <div className="w-1/2" style={{ backgroundColor: p.primaria }} />
                <div className="w-1/2" style={{ backgroundColor: p.secundaria }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">{p.nome}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-2">
        <p className="text-sm font-medium text-gray-700 mb-3 text-center">Ou escolha suas próprias cores</p>
        <div className="flex gap-4 justify-center">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Principal</label>
            <input
              type="color"
              value={form.cor_primaria}
              onChange={(e) => setForm({ ...form, cor_primaria: e.target.value })}
              className="w-16 h-16 border rounded-lg p-1 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Secundária</label>
            <input
              type="color"
              value={form.cor_secundaria}
              onChange={(e) => setForm({ ...form, cor_secundaria: e.target.value })}
              className="w-16 h-16 border rounded-lg p-1 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}

export default ColorsStep;