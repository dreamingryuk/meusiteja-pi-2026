import React from 'react';
import { Link } from 'react-router-dom';

function PortfolioCard({ portfolio }) {
  const { uid, nome, titulo, foto, cor_primaria } = portfolio;

  return (
    <Link to={`/portfolio/${uid}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="h-32 bg-gray-200 flex items-center justify-center" style={{ backgroundColor: cor_primaria || '#3B82F6' }}>
          {foto ? (
            <img src={foto} alt={nome} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-500">
              👤
            </div>
          )}
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{nome || 'Usuário'}</h3>
          <p className="text-sm text-gray-600 truncate">{titulo || 'Profissional'}</p>
        </div>
      </div>
    </Link>
  );
}

export default PortfolioCard;