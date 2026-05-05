import React from 'react';

export default function GeometricDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Círculo azul pastel no canto superior esquerdo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>

      {/* Círculo rosa blush no canto inferior direito */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl"></div>

      {/* Quadrado azul pastel com rotação */}
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-blue-300 opacity-10 transform rotate-45 blur-2xl"></div>

      {/* Linha diagonal rosa blush */}
      <div className="absolute top-1/3 left-1/4 w-1 h-96 bg-gradient-to-b from-pink-200 to-transparent opacity-20 transform -rotate-45"></div>

      {/* Pequeno círculo rosa no meio */}
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-300 rounded-full opacity-15 blur-2xl"></div>
    </div>
  );
}
