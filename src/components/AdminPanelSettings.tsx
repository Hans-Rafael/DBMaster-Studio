import React from 'react';
import { Settings, Lock, Mail } from 'lucide-react';

interface SettingsTabProps {
  adminProfile: any;
  showChangePassword: boolean;
  setShowChangePassword: (show: boolean) => void;
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  newRecoveryEmail: string;
  setNewRecoveryEmail: (value: string) => void;
  handleChangePassword: (e: React.FormEvent) => void;
  handleUpdateRecoveryEmail: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  adminProfile,
  showChangePassword,
  setShowChangePassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  newRecoveryEmail,
  setNewRecoveryEmail,
  handleChangePassword,
  handleUpdateRecoveryEmail
}) => (
  <div className="space-y-6">
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <Settings className="w-5 h-5" />
        <span>Configuración de Cuenta</span>
      </h3>

      {/* Profile Info */}
      <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Email</label>
            <p className="text-white font-medium">{adminProfile?.email || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Email de Recuperación</label>
            <p className="text-white font-medium">{adminProfile?.recovery_email || 'No configurado'}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Creado</label>
            <p className="text-white font-medium">{adminProfile?.created_at ? new Date(adminProfile.created_at).toLocaleString('es-ES') : 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Último Login</label>
            <p className="text-white font-medium">{adminProfile?.last_login ? new Date(adminProfile.last_login).toLocaleString('es-ES') : 'Nunca'}</p>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Cambiar Contraseña</span>
          </h4>
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showChangePassword ? 'Cancelar' : 'Cambiar'}
          </button>
        </div>

        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña Actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Actualizar Contraseña
            </button>
          </form>
        )}
      </div>

      {/* Recovery Email Section */}
      <div>
        <h4 className="text-md font-semibold text-white mb-4 flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>Email de Recuperación</span>
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email de Recuperación</label>
            <input
              type="email"
              value={newRecoveryEmail}
              onChange={(e) => setNewRecoveryEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tu-email@ejemplo.com"
            />
          </div>
          <button
            onClick={handleUpdateRecoveryEmail}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            Actualizar Email de Recuperación
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Este email se usará para recuperar tu contraseña si la olvidas.
          </p>
        </div>
      </div>
    </div>
  </div>
);