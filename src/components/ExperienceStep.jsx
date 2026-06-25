import React, { useState } from 'react';

function ExperienceStep({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    empresa: data.empresa || '',
    cargo: data.cargo || '',
    descricao_exp: data.descricao_exp || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Experiência profissional</h2>
      <p className="text-gray-500 text-sm -mt-2">Liste as empresas onde você trabalhou</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
        <input
          type="text"
          value={form.empresa}
          onChange={(e) => setForm({ ...form, empresa: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Nome da empresa"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
        <input
          type="text"
          value={form.cargo}
          onChange={(e) => setForm({ ...form, cargo: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Seu cargo"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={form.descricao_exp}
          onChange={(e) => setForm({ ...form, descricao_exp: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
          rows="3"
          placeholder="O que você fazia?"
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

export default ExperienceStep;