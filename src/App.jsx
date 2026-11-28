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
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pilares" element={<Pilares />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/banco-prompters" element={<BancoPrompters />} />
          <Route path="banco-asistentes" element={<BancoAsistentes/>} />
          <Route path="/dev" element={<DevZone />} />
        </Route>

        <Route path="/login" element={<Login />} />

       <Route element={<AdminRoute />}>
         <Route path="/admin/cursos" element={<AdminCursos />} />
        </Route>

      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;