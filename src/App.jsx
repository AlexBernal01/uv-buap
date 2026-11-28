import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import DevZone from './pages/DevZone';
import Pilares from './pages/Pilares';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Noticias from './pages/Noticias';
import Cursos from './pages/Cursos';
import BancoPrompters from './pages/BancoPrompters';
import Chatbot from './components/Chatbot';
import BancoAsistentes from './pages/BancoAsistentes';

import Login from './pages/Login';
import AdminCursos from './pages/AdminCursos';
import AdminProductos from './pages/AdminProductos';
import AdminDevZone from './pages/AdminDevZone'; // <-- Importar
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
          <Route element={<AdminLayout />}>
            <Route path="/admin/cursos" element={<AdminCursos />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
            <Route path="/admin/devzone" element={<AdminDevZone />} /> {/* <-- Nueva ruta */}
          </Route>
        </Route>
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;