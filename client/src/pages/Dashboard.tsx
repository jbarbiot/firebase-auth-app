import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import GeometricDecoration from '../components/GeometricDecoration';

interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        } else {
          setError('Dados do usuário não encontrados');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  // Calcular idade
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Elementos decorativos geométricos */}
      <GeometricDecoration />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-900">Meu Perfil</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
            <p className="mt-4 text-slate-600">Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-bold">Erro</p>
            <p className="text-red-600 text-sm mt-2">{error}</p>
          </div>
        ) : userData ? (
          <div className="space-y-6">
            {/* Card de Boas-vindas */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Bem-vindo, {userData.firstName}! 👋
              </h2>
              <p className="text-slate-500 font-light">
                Aqui estão seus dados cadastrados
              </p>
            </div>

            {/* Card de Informações Pessoais */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-black text-slate-900 mb-6">
                Informações Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Completo */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Nome Completo
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {userData.firstName} {userData.lastName}
                  </p>
                </div>

                {/* Data de Nascimento */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Data de Nascimento
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {formatDate(userData.birthDate)}
                  </p>
                </div>

                {/* Idade */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                    Idade
                  </p>
                  <p className="text-xl font-black text-blue-900">
                    {calculateAge(userData.birthDate)} anos
                  </p>
                </div>

                {/* Email */}
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-xs font-bold text-pink-600 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-lg font-bold text-pink-900 break-all">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Card de Identificação */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-black text-slate-900 mb-4">
                Identificação do Usuário
              </h3>
              <div className="p-4 bg-slate-50 rounded-lg font-mono text-xs text-slate-600 break-all">
                UID: {user?.uid}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
