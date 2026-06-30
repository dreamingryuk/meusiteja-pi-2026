import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  const handleCreateOrEdit = () => {
    navigate('/criar');
  };

  const handleGallery = () => {
    navigate('/galeria');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MeuSiteJa</h1>
        <button
          onClick={handleGallery}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Ver portfolios
        </button>
      </header>

      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Crie seu <span className="text-blue-600">portfólio</span> profissional em minutos
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              O MeuSiteJa é uma plataforma criada por 5 alunos do IFC Campus Concórdia
              para ajudar você a ter uma presença online incrível.
            </p>

            <button
              onClick={handleCreateOrEdit}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
            >
              🚀 Criar meu site já
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pronto em 5 minutos</h3>
                <p className="text-gray-600">Escolha um template, personalize e publique seu site.</p>
                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Grátis</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Sem código</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">IA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

<section className="container mx-auto px-6 py-24">
  <div className="grid md:grid-cols-2 gap-12">

    {/* Sobre nós */}
    <div className="md:pr-10 md:border-r border-gray-300">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Sobre nós
      </h2>

      <p className="text-gray-600 leading-8">
        O <span className="font-semibold text-blue-600">MeuSiteJa</span> é um
        projeto desenvolvido por estudantes do IFC Campus Concórdia com o
        objetivo de facilitar a criação de portfólios profissionais.
        Nossa plataforma permite criar um site moderno, responsivo e sem
        precisar programar.
      </p>
    </div>

    {/* Contato */}
    <div className="md:pl-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Entre em contato
      </h2>

      <p className="text-gray-600 mb-8">
        Tem alguma dúvida ou sugestão? Entre em contato conosco.
      </p>

      <div className="space-y-6">

        <div className="flex items-center gap-4">
          <span className="text-3xl">📧</span>

          <div>
            <h3 className="font-semibold">E-mail</h3>
            <p className="text-gray-600">
              contato@meusiteja.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl">📍</span>

          <div>
            <h3 className="font-semibold">Localização</h3>
            <p className="text-gray-600">
              IFC Campus Concórdia
              <br />
              Concórdia - SC
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          © 2026 MeuSiteJa - Criado por alunos do IFC Campus Concórdia
        </p>
      </footer>
    </div>
  );
}

export default Hero;
