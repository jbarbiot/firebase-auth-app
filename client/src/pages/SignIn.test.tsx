import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './SignIn';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase config
vi.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
  default: {},
}));

describe('SignIn Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render signin form with email and password fields', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    expect(screen.getByText('Bem-vindo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
    });
  });

  it('should have link to signup page', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const signUpLink = screen.getByRole('link', { name: /Crie uma agora/i });
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });

  it('should show loading state when submitting', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    expect(submitButton).not.toBeDisabled();
  });
});
