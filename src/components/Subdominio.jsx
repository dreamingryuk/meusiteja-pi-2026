import React, { useState } from 'react';
import { db, collection, query, where, getDocs } from '../config/firebase';

function SubdomainStep({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    subdominio: data.subdominio || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subdominio) return;

    setLoading(true);
    try {
      const q = query(collection(db, 'sites'), where('subdominio', '==', form.subdominio));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert('Este subdomínio já está em uso. Escolha outro.');
        setLoading(false);
        return;
      }
      onNext(form);
    } catch (error) {
      console.error('Erro ao verificar subdomínio:', error);
      alert('Erro ao verificar subdomínio. Tente novamente.');
    }
    setLoading(false);
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
            onChange={(e) => setForm({ ...form, subdominio: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="meuportfolio"
            required
            disabled={loading}
          />
          <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-600">
            .meusiteja.com
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Use apenas letras minúsculas e números, sem espaços.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
          disabled={loading}
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white font-medium py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Finalizar'}
        </button>
      </div>
    </form>
  );
}

export default SubdomainStep;