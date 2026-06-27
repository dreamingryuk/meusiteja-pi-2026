import React, { useState } from 'react';

function Formacao({ onNext, onBack, data }) {
  const [educacoes, setEducacoes] = useState(data.educacoes || []);
  const [current, setCurrent] = useState({ instituicao: '', curso: '', ano: '' });

  const addEducation = () => {
    if (current.instituicao.trim() && current.curso.trim()) {
      setEducacoes([...educacoes, { ...current }]);
      setCurrent({ instituicao: '', curso: '', ano: '' });
    } else {
      alert('Preencha instituição e curso.');
    }
  };

  const removeEducation = (index) => {
    setEducacoes(educacoes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ educacoes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Formação acadêmica</h2>
      <p className="text-gray-500 text-sm -mt-2">Adicione sua formação e cursos realizados (opcional)</p>
      
      <div className="border p-4 rounded">
        <h4 className="font-medium mb-2">Adicionar formação</h4>
        <div className="space-y-3">
          <input
            type="text"
            value={current.instituicao}
            onChange={(e) => setCurrent({ ...current, instituicao: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Instituição"
          />
          <input
            type="text"
            value={current.curso}
            onChange={(e) => setCurrent({ ...current, curso: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Curso"
          />
          <input
            type="text"
            value={current.ano}
            onChange={(e) => setCurrent({ ...current, ano: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Ano (opcional)"
          />
          <button
            type="button"
            onClick={addEducation}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Adicionar
          </button>
        </div>
      </div>

      {educacoes.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Formações adicionadas</h4>
          {educacoes.map((edu, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <div>
                <p className="font-medium">{edu.instituicao}</p>
                <p className="text-sm text-gray-600">{edu.curso}</p>
                {edu.ano && <p className="text-sm text-gray-500">{edu.ano}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeEducation(index)}
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

export default Formacao;