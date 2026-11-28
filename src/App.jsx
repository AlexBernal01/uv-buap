import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DevZone from './pages/DevZone';
import Pilares from './pages/Pilares';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Noticias from './pages/Noticias';
import Cursos from './pages/Cursos';
import BancoPrompters from './pages/BancoPrompters';
import Chatbot from './components/Chatbot';
import CursoDetalle from './pages/CursoDetalle';
import BancoAsistentes from './pages/BancoAsistentes';

// --- IMPORTACIONES NUEVAS (Seguridad y Admin) ---
import Login from './pages/Login';
import AdminCursos from './pages/AdminCursos';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================= */}
        {/* PÁGINAS PÚBLICAS (Con Navbar y Footer)    */}
        {/* ========================================= */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pilares" element={<Pilares />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoDetalle />} />
          <Route path="/banco-prompters" element={<BancoPrompters />} />
          <Route path="banco-asistentes" element={<BancoAsistentes/>} />
          <Route path="/dev" element={<DevZone />} />
        </Route>

        {/* ========================================= */}
        {/* PÁGINAS DE AUTENTICACIÓN (Sin Layout)     */}
        {/* ========================================= */}
        <Route path="/login" element={<Login />} />

        {/* ========================================= */}
        {/* PÁGINAS PROTEGIDAS (Solo para Admin)      */}
        {/* ========================================= */}
        <Route element={<AdminRoute />}>
          {/* Si un usuario normal intenta entrar a /admin/cursos, 
              el AdminRoute lo rebotará al /login automáticamente */}
          <Route path="/admin/cursos" element={<AdminCursos />} />
        </Route>

      </Routes>
      
      {/* El Chatbot flotante se queda aquí, aparece en todas las páginas */}
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;