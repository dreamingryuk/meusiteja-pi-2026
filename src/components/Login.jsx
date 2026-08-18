import React, { useState } from 'react';
import { auth, db, doc, getDoc } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

function Login({ onNext, onBack }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, senha);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      }
      const uid = userCredential.user.uid;

      const siteRef = doc(db, 'sites', uid);
      const siteSnap = await getDoc(siteRef);
      
      if (siteSnap.exists()) {
        // Usuário já tem site → redireciona para preview com isNewCreation = false
        onNext({ 
          email, 
          senha, 
          uid, 
          existingSite: siteSnap.data(),
          isNewCreation: false // Importante: não rodar IA novamente
        });
      } else {
        // Novo usuário ou sem site → continua o formulário
        onNext({ email, senha, uid, existingSite: null });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Acesse sua conta</h2>
        <p className="text-gray-500 text-sm">Entre ou cadastre-se para continuar</p>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="seu@email.com"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="flex justify-between text-sm">
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline">
          {isLogin ? 'Criar conta' : 'Já tenho conta'}
        </button>
      </div>
      
      <div className="flex gap-3 pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Voltar
          </button>
        )}
        <button type="submit" className="flex-1 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition">
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}

export default Login;