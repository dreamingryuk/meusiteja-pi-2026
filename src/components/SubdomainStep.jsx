// components/SubdomainStep.js - Versão corrigida (sem isLast)
import React, { useState } from 'react';

function SubdomainStep({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    subdominio: data.subdominio || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Escolha seu link</h2>
      <p className="text-gray-500 text-sm -mt-2">Defina o endereço único do seu site na internet</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subdomínio *</label>
        <div className="flex items-center">
          <input
            type="text"
            value={form.subdominio}
            onChange={(e) => setForm({ ...form, subdominio: e.target.value })}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="meuportfolio"
            required
          />
          <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-600">
            .meusite.com
          </span>
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
          className="flex-1 bg-green-500 text-white font-medium py-2 rounded-lg hover:bg-green-600 transition"
        >
          Finalizar
        </button>
      </div>
    </form>
  );
}

export default SubdomainStep;