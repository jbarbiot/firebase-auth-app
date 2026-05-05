import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GeometricDecoration from '../components/GeometricDecoration';

// Schema de validação do formulário
const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Fazer login com Firebase Authentication
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // Redirecionar para dashboard
      navigate('/');
    } catch (err: any) {
      // Tratamento de erros específicos do Firebase
      if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Verifique o email ou crie uma conta.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Email ou senha incorretos. Verifique seus dados e tente novamente.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else if (err.code === 'auth/user-disabled') {
        setError('Usuário desativado');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas de login. Tente novamente mais tarde.');
      } else {
        setError('Email ou senha incorretos. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos geométricos */}
      <GeometricDecoration />

      <div className="w-full max-w-md">
        {/* Card do formulário */}
        <div className="bg-white rounded-lg shadow-sm p-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Bem-vindo
            </h1>
            <p className="text-slate-500 font-light">
              Entre com seu email e senha para acessar
            </p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Senha
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold py-3 rounded-lg hover:from-blue-400 hover:to-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Link para Cadastro */}
          <p className="text-center text-slate-600 text-sm mt-6">
            Não tem conta?{' '}
            <Link to="/signup" className="text-blue-400 font-bold hover:text-blue-500">
              Crie uma agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
