import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Componente para proteger rotas que requerem autenticação
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

// Definição das rotas da aplicação
export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
