import { useState, useEffect } from 'react';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  // Ajusta estos campos según las columnas de tu tabla 'productos'
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', imagen_url: '', precio: '' });
  const [cargando, setCargando] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('uvie_token');

  const fetchProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProductos();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const abrirModal = (producto = null) => {
    if (producto) {
      setEditando(producto.id);
      setFormData(producto);
    } else {
      setEditando(null);
      setFormData({ titulo: '', descripcion: '', imagen_url: '', precio: '' });
    }
    setModalAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    const url = editando ? `${API_URL}/productos/${editando}` : `${API_URL}/productos`;
    const method = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalAbierto(false);
        fetchProductos();
      } else {
        alert('Error al guardar. Verifica que el backend acepte estos campos.');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-buap-azul-oscuro">Gestión de Productos</h1>
          <p className="text-gray-500 mt-2">Administra los productos insignia de la UVIE.</p>
        </div>
        <button onClick={() => abrirModal()} className="bg-buap-azul-oscuro text-white px-6 py-3 rounded-xl font-bold hover:bg-buap-azul-claro transition">
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-bold">Nombre / Título</th>
              <th className="p-4 font-bold">Precio</th>
              <th className="p-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{producto.titulo || producto.nombre}</td>
                <td className="p-4 text-gray-600">{producto.precio ? `$${producto.precio}` : 'N/A'}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => abrirModal(producto)} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => handleEliminar(producto.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan="3" className="text-center p-8 text-gray-400">No hay productos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-buap-azul-oscuro">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Nombre del Producto *</label>
                  <input type="text" value={formData.titulo || formData.nombre || ''} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required className="w-full p-3 border rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Descripción</label>
                  <textarea value={formData.descripcion || ''} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="3" className="w-full p-3 border rounded-lg"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Precio (Opcional)</label>
                  <input type="number" step="0.01" value={formData.precio || ''} onChange={(e) => setFormData({...formData, precio: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">URL de la Imagen</label>
                  <input type="url" value={formData.imagen_url || ''} onChange={(e) => setFormData({...formData, imagen_url: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalAbierto(false)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Cancelar</button>
                <button type="submit" disabled={cargando} className="px-6 py-2 rounded-lg font-bold text-white bg-buap-azul-oscuro hover:bg-buap-azul-claro">
                  {cargando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}