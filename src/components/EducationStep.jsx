import React, { useState } from 'react';

function EducationStep({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    instituicao: data.instituicao || '',
    curso: data.curso || '',
    ano: data.ano || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Formação acadêmica</h2>
      <p className="text-gray-500 text-sm -mt-2">Adicione sua formação e cursos realizados</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instituição *</label>
        <input
          type="text"
          value={form.instituicao}
          onChange={(e) => setForm({ ...form, instituicao: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Nome da instituição"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Curso *</label>
        <input
          type="text"
          value={form.curso}
          onChange={(e) => setForm({ ...form, curso: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Nome do curso"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ano de conclusão</label>
        <input
          type="number"
          value={form.ano}
          onChange={(e) => setForm({ ...form, ano: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="2024"
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

export default EducationStep;