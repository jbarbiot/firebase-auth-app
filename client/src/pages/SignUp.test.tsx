import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getFirestore: vi.fn(),
}));

// Mock Firebase config
vi.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
  default: {},
}));

describe('SignUp Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render signup form with all required fields', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('João')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Silva')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /Criar Conta/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Criar Conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Nome deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
    });
  });

  it('should show error when passwords do not match', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const firstNameInput = screen.getByPlaceholderText('João');
    const lastNameInput = screen.getByPlaceholderText('Silva');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const dateInput = screen.getByDisplayValue('');
    const passwordInputs = screen.getAllByPlaceholderText('••••••');

    fireEvent.change(firstNameInput, { target: { value: 'João' } });
    fireEvent.change(lastNameInput, { target: { value: 'Silva' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password456' } });

    const submitButton = screen.getByRole('button', { name: /Criar Conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/As senhas não coincidem/i)).toBeInTheDocument();
    });
  });

  it('should have link to sign in page', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const signInLink = screen.getByRole('link', { name: /Faça login/i });
    expect(signInLink).toHaveAttribute('href', '/signin');
  });
});
