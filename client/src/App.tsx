import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
