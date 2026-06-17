import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Carros from './pages/Carros';
import Motos from './pages/Motos';
import MarcasRoupa from './pages/MarcasRoupa';
import Usuarios from './pages/Usuarios';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>

            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Rotas protegidas — exigem login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/carros"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Carros />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/motos"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Motos />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-roupa"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MarcasRoupa />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Usuarios />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Qualquer rota não encontrada redireciona para home */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}