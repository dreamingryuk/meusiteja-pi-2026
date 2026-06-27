import React, { useState } from 'react';

function Experiencia({ onNext, onBack, data }) {
  const [experiencias, setExperiencias] = useState(data.experiencias || []);
  const [current, setCurrent] = useState({ empresa: '', cargo: '', descricao: '' });

  const addExperience = () => {
    if (current.empresa.trim() && current.cargo.trim()) {
      setExperiencias([...experiencias, { ...current }]);
      setCurrent({ empresa: '', cargo: '', descricao: '' });
    } else {
      alert('Preencha empresa e cargo.');
    }
  };

  const removeExperience = (index) => {
    setExperiencias(experiencias.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ experiencias });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Experiência profissional</h2>
      <p className="text-gray-500 text-sm -mt-2">Liste as empresas onde você trabalhou (opcional)</p>
      
      <div className="border p-4 rounded">
        <h4 className="font-medium mb-2">Adicionar experiência</h4>
        <div className="space-y-3">
          <input
            type="text"
            value={current.empresa}
            onChange={(e) => setCurrent({ ...current, empresa: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Empresa"
          />
          <input
            type="text"
            value={current.cargo}
            onChange={(e) => setCurrent({ ...current, cargo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Cargo"
          />
          <textarea
            value={current.descricao}
            onChange={(e) => setCurrent({ ...current, descricao: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
            rows="2"
            placeholder="Descrição (opcional)"
          />
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Adicionar
          </button>
        </div>
      </div>

      {experiencias.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Experiências adicionadas</h4>
          {experiencias.map((exp, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <div>
                <p className="font-medium">{exp.empresa}</p>
                <p className="text-sm text-gray-600">{exp.cargo}</p>
                {exp.descricao && <p className="text-sm text-gray-500">{exp.descricao}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

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

export default Experiencia;