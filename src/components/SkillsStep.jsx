import React, { useState } from 'react';

function SkillsStep({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    tecnicas: data.tecnicas || '',
    pessoais: data.pessoais || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Habilidades</h2>
      <p className="text-gray-500 text-sm -mt-2">Avalie suas competências técnicas e pessoais</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades técnicas</label>
        <input
          type="text"
          value={form.tecnicas}
          onChange={(e) => setForm({ ...form, tecnicas: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="JavaScript, React, Python, Git"
        />
        <p className="text-xs text-gray-500 mt-1">Separe por vírgula</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades interpessoais</label>
        <input
          type="text"
          value={form.pessoais}
          onChange={(e) => setForm({ ...form, pessoais: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Comunicação, Liderança, Trabalho em equipe"
        />
        <p className="text-xs text-gray-500 mt-1">Separe por vírgula</p>
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

export default SkillsStep;