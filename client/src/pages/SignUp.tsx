import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import GeometricDecoration from '../components/GeometricDecoration';

// Schema de validação do formulário
const signUpSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  birthDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate < today;
  }, 'Data de nascimento inválida'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        email: data.email,
        createdAt: new Date().toISOString(),
      });

      // Redirecionar para dashboard
      navigate('/');
    } catch (err: any) {
      // Tratamento de erros específicos do Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado');
      } else if (err.code === 'auth/weak-password') {
        setError('Senha muito fraca');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else {
        setError(err.message || 'Erro ao criar conta');
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
              Criar Conta
            </h1>
            <p className="text-slate-500 font-light">
              Preencha os dados abaixo para se cadastrar
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
            {/* Nome */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Nome
              </label>
              <input
                {...register('firstName')}
                type="text"
                placeholder="João"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* Sobrenome */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Sobrenome
              </label>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Silva"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Data de Nascimento
              </label>
              <input
                {...register('birthDate')}
                type="date"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
              {errors.birthDate && (
                <p className="text-red-600 text-xs mt-1">{errors.birthDate.message}</p>
              )}
            </div>

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

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Confirmar Senha
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold py-3 rounded-lg hover:from-blue-400 hover:to-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Link para Login */}
          <p className="text-center text-slate-600 text-sm mt-6">
            Já tem conta?{' '}
            <Link to="/signin" className="text-blue-400 font-bold hover:text-blue-500">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
