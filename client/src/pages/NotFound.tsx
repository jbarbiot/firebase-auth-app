import React from 'react';
import { Link } from 'react-router-dom';
import GeometricDecoration from '../components/GeometricDecoration';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos geométricos */}
      <GeometricDecoration />

      <div className="text-center relative z-10">
        <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
        <p className="text-xl text-slate-600 font-light mb-8">
          Página não encontrada
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold rounded-lg hover:from-blue-400 hover:to-blue-500 transition"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
