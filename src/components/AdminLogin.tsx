import React, { useState } from 'react';
import { Lock, AlertCircle, Loader2, Shield, Mail } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToMain: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToMain }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Intentando login admin con:', { email, password: '***' });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Importante para cookies
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        onLoginSuccess();
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySuccess('');
    setRecoveryLoading(true);

    try {
      const response = await fetch('/api/admin/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.emailSent) {
          setRecoverySuccess('Contraseña temporal enviada a tu correo electrónico. Revisa tu bandeja de entrada.');
        } else {
          setRecoverySuccess(`Contraseña temporal generada: ${data.tempPassword} (expira: ${new Date(data.expiresAt).toLocaleString('es-ES')})`);
        }
        setShowRecovery(false);
        setRecoveryEmail('');
      } else {
        setError(data.error || 'Error al recuperar contraseña');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Administración</h1>
            <p className="text-slate-400 text-sm">Panel de control de DBMaster Studio</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email de Administrador
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="admin@dbmaster.studio"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Ingresar como Admin</span>
              )}
            </button>
          </form>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={onBackToMain}
              className="w-full py-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← Volver al login de estudiantes
            </button>
            
            <button
              onClick={() => setShowRecovery(!showRecovery)}
              className="w-full py-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors mt-2"
            >
              {showRecovery ? '← Cancelar recuperación' : '¿Olvidaste tu contraseña?'}
            </button>
          </div>

          {/* Recovery Form */}
          {showRecovery && (
            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Recuperar Contraseña</span>
              </h4>
              <form onSubmit={handleRecovery} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email de Administrador
                  </label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="admin@dbmaster.studio"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={recoveryLoading || !recoveryEmail}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                  {recoveryLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <span>Enviar Contraseña Temporal</span>
                  )}
                </button>
              </form>
              {recoverySuccess && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {recoverySuccess}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};