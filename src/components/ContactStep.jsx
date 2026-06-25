import React, { useState } from 'react';

function ContactStep({ onNext, onBack, data }) {
  const [form, setForm] = useState({
    email: data.email || '',
    telefone: data.telefone || '',
    instagram: data.instagram || '',
    linkedin: data.linkedin || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Informações de contato</h2>
      <p className="text-gray-500 text-sm -mt-2">Como as pessoas podem te encontrar</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
        <input
          type="tel"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="(11) 99999-9999"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
        <input
          type="text"
          value={form.instagram}
          onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="@usuario"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
        <input
          type="text"
          value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="linkedin.com/in/usuario"
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

export default ContactStep;