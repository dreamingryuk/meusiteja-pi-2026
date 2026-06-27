import React, { useState } from 'react';

function Carreira({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    nome: data.nome || '',
    titulo: data.titulo || '',
    descricao: data.descricao || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Informações básicas</h2>
      <p className="text-gray-500 text-sm -mt-2">Conte-nos sobre você e sua carreira profissional</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Seu nome completo"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título profissional *</label>
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Ex: Desenvolvedor Front-end"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição breve *</label>
        <textarea
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
          rows="3"
          placeholder="Conte um pouco sobre você..."
          required
        />
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

export default Carreira;