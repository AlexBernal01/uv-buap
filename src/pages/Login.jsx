import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('uvie_token', data.token);
        localStorage.setItem('uvie_user', JSON.stringify(data.usuario));
        navigate('/admin/cursos'); 
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('https://www.buap.mx/sites/default/files/2022-08/edificio_historico_buap.jpg')] bg-cover bg-center bg-blend-overlay bg-opacity-80 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border-t-8 border-buap-azul-oscuro">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-buap-azul-oscuro uppercase tracking-wider">Panel de Administración</h2>
          <p className="mt-2 text-sm text-gray-500">Acceso exclusivo para personal UVIE</p>
        </div>

        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm text-center">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Correo Institucional</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buap-azul-oscuro focus:border-buap-azul-oscuro transition-all"
                placeholder="admin@buap.mx" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buap-azul-oscuro focus:border-buap-azul-oscuro transition-all"
                placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-buap-azul-oscuro hover:bg-buap-azul-claro transition-all duration-300">
            Iniciar Sesión
          </button>
        </form>
        
        <div className="text-center mt-6 text-xs text-gray-400">
          Benemérita Universidad Autónoma de Puebla © 2026
        </div>
      </div>
    </div>
  );
}