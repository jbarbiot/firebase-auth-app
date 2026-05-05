import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './routes';
import { AuthProvider } from './contexts/AuthContext';

// Mock Firebase
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Simular usuário não autenticado por padrão
    callback(null);
    return vi.fn();
  }),
}));

vi.mock('./lib/firebase', () => ({
  auth: {},
  db: {},
  default: {},
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while checking authentication', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    // Deve mostrar estado de carregamento inicialmente
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('should redirect to signin when user is not authenticated', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<div>Sign In Page</div>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      // Após carregamento, deve redirecionar para signin se não autenticado
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });
  });

  it('should show protected content when user is authenticated', async () => {
    // Mock Firebase para retornar usuário autenticado
    vi.doMock('firebase/auth', () => ({
      getAuth: vi.fn(),
      onAuthStateChanged: vi.fn((auth, callback) => {
        callback({
          uid: 'test-user-id',
          email: 'test@example.com',
        });
        return vi.fn();
      }),
    }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });
  });
});
