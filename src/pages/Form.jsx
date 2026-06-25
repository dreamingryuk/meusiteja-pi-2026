// src/pages/Form.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthStep from '../components/AuthStep';
import BasicStep from '../components/BasicStep';
import AboutStep from '../components/AboutStep';
import ExperienceStep from '../components/ExperienceStep';
import EducationStep from '../components/EducationStep';
import SkillsStep from '../components/SkillsStep';
import ContactStep from '../components/ContactStep';
import PhotoStep from '../components/PhotoStep';
import ColorsStep from '../components/ColorsStep';
import SubdomainStep from '../components/SubdomainStep';

function Form() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const navigate = useNavigate();

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

  const next = (newData) => {
    const updated = { ...data, ...newData };
    setData(updated);

    // Se o login retornou um site existente, vai direto pro preview
    if (newData.existingSite) {
      navigate('/preview', { state: { data: { ...updated, ...newData.existingSite }, uid: newData.uid } });
      return;
    }

    if (newData.uid) {
      // Guarda o uid para uso posterior
    }

    if (isLast) {
      navigate('/preview', { state: { data: updated, uid: data.uid } });
    } else {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch(currentStep.id) {
      case 'auth': return <AuthStep onNext={next} data={data} />;
      case 'basic': return <BasicStep onNext={next} onBack={back} data={data} />;
      case 'about': return <AboutStep onNext={next} onBack={back} data={data} />;
      case 'experience': return <ExperienceStep onNext={next} onBack={back} data={data} />;
      case 'education': return <EducationStep onNext={next} onBack={back} data={data} />;
      case 'skills': return <SkillsStep onNext={next} onBack={back} data={data} />;
      case 'contact': return <ContactStep onNext={next} onBack={back} data={data} />;
      case 'photo': return <PhotoStep onNext={next} onBack={back} data={data} uid={data.uid} />;
      case 'colors': return <ColorsStep onNext={next} onBack={back} data={data} />;
      case 'subdomain': return <SubdomainStep onNext={next} onBack={back} data={data} />;
      default: return <div>Passo não encontrado</div>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
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

export default Form;