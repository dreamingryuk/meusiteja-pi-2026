import React, { useState } from 'react';
import { auth, db, doc, getDoc } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

function Login({ onNext, onBack }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      let userCredential;

      // =========================================================
      // 1. AUTENTICAÇÃO
      // =========================================================
      //
      // O login/cadastro acontece exclusivamente pelo Firebase.
      // Não existe mais UID "demo-" ou usuário falso.
      //
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );
      }

      // =========================================================
      // 2. PEGAR O UID REAL DO FIREBASE AUTHENTICATION
      // =========================================================
      const user = userCredential.user;

      if (!user) {
        throw new Error(
          'O Firebase não retornou um usuário autenticado.'
        );
      }

      const uid = user.uid;

      console.log('Usuário autenticado com sucesso.');
      console.log('Firebase Auth UID:', uid);
      console.log('Email:', user.email);

      // =========================================================
      // 3. PROCURAR O SITE DO USUÁRIO
      // =========================================================
      //
      // Essa consulta é separada da autenticação.
      //
      // Se o Firestore tiver algum problema, NÃO vamos trocar
      // o UID real por um UID "demo".
      //
      let existingSite = null;

      try {
        const siteRef = doc(db, 'sites', uid);
        const siteSnap = await getDoc(siteRef);

        if (siteSnap.exists()) {
          existingSite = siteSnap.data();

          console.log(
            'Site encontrado no Firestore:',
            existingSite
          );
        } else {
          console.log(
            'Nenhum site encontrado para este usuário.'
          );
        }
      } catch (firestoreError) {
        console.error(
          'Erro ao consultar o site no Firestore:',
          firestoreError
        );

        /*
         * IMPORTANTE:
         *
         * Não fazemos:
         *
         * uid = 'demo-' + ...
         *
         * O usuário continua com o UID REAL do Firebase.
         *
         * Isso evita o problema em que:
         *
         * Firebase Auth UID = ABC123
         *
         * mas o documento usa:
         *
         * uid = demo-email...
         *
         * e as regras do Firestore recusam a gravação.
         */
      }

      // =========================================================
      // 4. CONTINUAR PARA O PRÓXIMO PASSO
      // =========================================================
      //
      // Não enviamos a senha para os componentes seguintes.
      // O Firebase já mantém a sessão autenticada.
      //
      onNext({
        email: user.email || email.trim(),
        uid,
        existingSite,
        isNewCreation: !existingSite
      });

    } catch (err) {
      console.error(
        'Erro de autenticação:',
        err
      );

      // =========================================================
      // TRATAMENTO DOS ERROS DO FIREBASE AUTH
      // =========================================================

      let message = 'Não foi possível entrar.';

      switch (err?.code) {
        case 'auth/invalid-credential':
          message = 'E-mail ou senha incorretos.';
          break;

        case 'auth/invalid-email':
          message = 'Digite um endereço de e-mail válido.';
          break;

        case 'auth/user-not-found':
          message = 'Usuário não encontrado.';
          break;

        case 'auth/wrong-password':
          message = 'Senha incorreta.';
          break;

        case 'auth/email-already-in-use':
          message =
            'Este e-mail já está cadastrado. Tente entrar na sua conta.';
          break;

        case 'auth/weak-password':
          message =
            'A senha é muito fraca. Use uma senha mais segura.';
          break;

        case 'auth/network-request-failed':
          message =
            'Não foi possível conectar ao Firebase. Verifique sua internet.';
          break;

        case 'auth/too-many-requests':
          message =
            'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
          break;

        case 'auth/operation-not-allowed':
          message =
            'O método de login por e-mail e senha não está habilitado no Firebase.';
          break;

        case 'auth/user-disabled':
          message =
            'Esta conta foi desativada.';
          break;

        default:
          message =
            err?.message ||
            'Ocorreu um erro ao autenticar.';
      }

      setError(message);

    } finally {
      setIsLoading(false);
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
