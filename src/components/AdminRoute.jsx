import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  
  const userString = localStorage.getItem('uvie_user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet />;
}