import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Clock, 
  Plus, 
  Trash2, 
  Key, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Loader2,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string | null;
  role: 'student' | 'restricted' | 'banned';
  session_expires_at: string | null;
  created_at: string;
  last_login: string | null;
}

interface TempPassword {
  id: string;
  password_hash: string;
  user_id: string | null;
  expires_at: string;
  created_at: string;
  used: boolean;
}

export const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'passwords'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [tempPasswords, setTempPasswords] = useState<TempPassword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (activeTab === 'users') {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          setError('Error al cargar usuarios');
        }
      } else {
        const response = await fetch('/api/admin/temp-passwords');
        const data = await response.json();
        if (response.ok) {
          setTempPasswords(data.passwords);
        } else {
          setError('Error al cargar contraseñas');
        }
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: newUsername, 
          password: newPassword, 
          email: newEmail || null 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Usuario creado exitosamente');
        setNewUsername('');
        setNewPassword('');
        setNewEmail('');
        setShowCreateUser(false);
        loadData();
      } else {
        setError(data.error || 'Error al crear usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Usuario eliminado exitosamente');
        loadData();
      } else {
        setError('Error al eliminar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleExtendSession = async (userId: string, days: number = 7) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/extend-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      });

      if (response.ok) {
        setSuccess(`Sesión extendida ${days} días exitosamente`);
        loadData();
      } else {
        setError('Error al extender sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleUpdateRole = async (userId: string, role: 'student' | 'restricted' | 'banned') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        setSuccess('Rol actualizado exitosamente');
        loadData();
      } else {
        setError('Error al actualizar rol');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleGeneratePassword = async (userId?: string) => {
    try {
      const response = await fetch('/api/admin/temp-passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Contraseña generada: ${data.password}`);
        if (activeTab === 'passwords') {
          loadData();
        }
      } else {
        setError('Error al generar contraseña');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDeletePassword = async (passwordId: string) => {
    try {
      const response = await fetch(`/api/admin/temp-passwords/${passwordId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Contraseña eliminada exitosamente');
        loadData();
      } else {
        setError('Error al eliminar contraseña');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES');
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      student: 'bg-green-500/20 text-green-400 border-green-500/30',
      restricted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      banned: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    const labels = {
      student: 'Estudiante',
      restricted: 'Restringido',
      banned: 'Bloqueado'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-slate-400">Gestión de usuarios y accesos</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadData}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Recargar datos"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center space-x-2 text-green-400 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'users' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Usuarios</span>
          </button>
          <button
            onClick={() => setActiveTab('passwords')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'passwords' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Contraseñas Temporales</span>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : activeTab === 'users' ? (
          <UsersTab
            users={users}
            showCreateUser={showCreateUser}
            setShowCreateUser={setShowCreateUser}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            handleCreateUser={handleCreateUser}
            handleDeleteUser={handleDeleteUser}
            handleExtendSession={handleExtendSession}
            handleUpdateRole={handleUpdateRole}
            handleGeneratePassword={handleGeneratePassword}
            getRoleBadge={getRoleBadge}
            formatDate={formatDate}
          />
        ) : (
          <PasswordsTab
            tempPasswords={tempPasswords}
            handleGeneratePassword={handleGeneratePassword}
            handleDeletePassword={handleDeletePassword}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab: React.FC<{
  users: User[];
  showCreateUser: boolean;
  setShowCreateUser: (show: boolean) => void;
  newUsername: string;
  setNewUsername: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  newEmail: string;
  setNewEmail: (value: string) => void;
  handleCreateUser: (e: React.FormEvent) => void;
  handleDeleteUser: (id: string) => void;
  handleExtendSession: (id: string, days?: number) => void;
  handleUpdateRole: (id: string, role: 'student' | 'restricted' | 'banned') => void;
  handleGeneratePassword: (userId?: string) => void;
  getRoleBadge: (role: string) => JSX.Element;
  formatDate: (date: string | null) => string;
}> = ({
  users,
  showCreateUser,
  setShowCreateUser,
  newUsername,
  setNewUsername,
  newPassword,
  setNewPassword,
  newEmail,
  setNewEmail,
  handleCreateUser,
  handleDeleteUser,
  handleExtendSession,
  handleUpdateRole,
  handleGeneratePassword,
  getRoleBadge,
  formatDate
}) => (
  <div className="space-y-6">
    {/* Create User Form */}
    {showCreateUser && (
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Crear Nuevo Usuario</h3>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Usuario</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="nombreusuario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Email (opcional)</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="usuario@email.com"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Crear Usuario
            </button>
            <button
              type="button"
              onClick={() => setShowCreateUser(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    )}

    {/* Users List */}
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Usuarios Registrados</h3>
        <button
          onClick={() => setShowCreateUser(!showCreateUser)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Usuario</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Rol</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Sesión Expira</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Creado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-white">{user.username}</td>
                  <td className="px-4 py-3 text-slate-400">{user.email || 'N/A'}</td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(user.session_expires_at)}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExtendSession(user.id, 7)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Extender sesión 7 días"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleGeneratePassword(user.id)}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="Generar contraseña temporal"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value as any)}
                        className="px-2 py-1 bg-slate-700 text-white text-xs rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="student">Estudiante</option>
                        <option value="restricted">Restringido</option>
                        <option value="banned">Bloqueado</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Passwords Tab Component
const PasswordsTab: React.FC<{
  tempPasswords: TempPassword[];
  handleGeneratePassword: (userId?: string) => void;
  handleDeletePassword: (id: string) => void;
  formatDate: (date: string | null) => string;
}> = ({ tempPasswords, handleGeneratePassword, handleDeletePassword, formatDate }) => (
  <div className="space-y-6">
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Contraseñas Temporales Activas</h3>
        <button
          onClick={() => handleGeneratePassword()}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Generar Contraseña</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Usuario ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Creada</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Expira</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tempPasswords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No hay contraseñas temporales activas
                </td>
              </tr>
            ) : (
              tempPasswords.map((pwd) => (
                <tr key={pwd.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-white font-mono text-sm">{pwd.id}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-sm">{pwd.user_id || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(pwd.created_at)}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(pwd.expires_at)}</td>
                  <td className="px-4 py-3">
                    {pwd.used ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">
                        Usada
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        Activa
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeletePassword(pwd.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar contraseña"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);