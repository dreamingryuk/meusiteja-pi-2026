import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Carreira from '../components/Carreira';
import Sobre from '../components/Sobre';
import Experiencia from '../components/Experiencia';
import Formacao from '../components/Formacao';
import Abilidades from '../components/Abilidades';
import Contato from '../components/Contato';
import Foto from '../components/Foto';
import Paleta from '../components/Paleta';
import Subdominio from '../components/Subdominio';
import { improveText } from '../services/groqService';

function Formulario() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 'auth', title: 'Acesse sua conta' },
    { id: 'basic', title: 'Informações básicas' },
    { id: 'about', title: 'Sobre você' },
    { id: 'experience', title: 'Experiência profissional' },
    { id: 'education', title: 'Formação acadêmica' },
    { id: 'skills', title: 'Habilidades' },
    { id: 'contact', title: 'Contato' },
    { id: 'photo', title: 'Foto profissional' },
    { id: 'colors', title: 'Paleta de cores' },
    { id: 'subdomain', title: 'Escolha seu link' }
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;
  const totalSteps = steps.length;
  const currentStepNumber = step + 1;
  const percentage = Math.round((currentStepNumber / totalSteps) * 100);

  const next = async (newData) => {
    const updated = { ...data, ...newData };
    setData(updated);

    if (newData.existingSite) {
      setUid(newData.uid);
      navigate('/preview', {
        state: {
          data: newData.existingSite,
          uid: newData.uid,
          isNewCreation: newData.isNewCreation || false,
          isPublicView: false
        }
      });
      return;
    }

    if (newData.uid) {
      setUid(newData.uid);
    }

    if (isLast) {
      setLoading(true);

      const improved = { ...updated };

      if (improved.descricao?.length > 10) {
        improved.descricao = await improveText(improved.descricao, 'descrição profissional');
      }
      if (improved.sobre?.length > 10) {
        improved.sobre = await improveText(improved.sobre, 'apresentação pessoal');
      }
      if (improved.experiencias?.length > 0) {
        improved.experiencias = await Promise.all(
          improved.experiencias.map(async (exp) => {
            if (exp.descricao?.length > 10) {
              return { ...exp, descricao: await improveText(exp.descricao, 'experiência profissional') };
            }
            return exp;
          })
        );
      }

      navigate('/preview', {
        state: {
          data: improved,
          uid: uid || newData.uid,
          fromLocalStorage: false,
          isNewCreation: false
        }
      });
    } else {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const goHome = () => {
    navigate('/');
  };

  const renderStep = () => {
    switch(currentStep.id) {
      case 'auth': return <Login onNext={next} onBack={back} />;
      case 'basic': return <Carreira onNext={next} onBack={back} data={data} />;
      case 'about': return <Sobre onNext={next} onBack={back} data={data} />;
      case 'experience': return <Experiencia onNext={next} onBack={back} data={data} />;
      case 'education': return <Formacao onNext={next} onBack={back} data={data} />;
      case 'skills': return <Abilidades onNext={next} onBack={back} data={data} />;
      case 'contact': return <Contato onNext={next} onBack={back} data={data} />;
      case 'photo': return <Foto onNext={next} onBack={back} data={data} uid={uid} />;
      case 'colors': return <Paleta onNext={next} onBack={back} data={data} />;
      case 'subdomain': return <Subdominio onNext={next} onBack={back} data={data} />;
      default: return <div>Passo não encontrado</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Gerando seu portfólio...</p>
          <p className="mt-1 text-gray-400 text-sm">A IA está melhorando seus textos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full relative">
        <button
          onClick={goHome}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
          title="Voltar ao início"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="border-b border-gray-200 pb-4 mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Criar Portfólio
          </h1>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Passo {currentStepNumber} de {totalSteps}</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-xs font-semibold">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center font-medium">
            {currentStep.title}
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}

export default Formulario;
