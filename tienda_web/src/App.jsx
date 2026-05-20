import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import ClientesPage from './pages/ClientesPage'
import ClienteFormPage from './pages/ClienteFormPage'
import ProductosPage from './pages/ProductosPage'
import ProductoFormPage from './pages/ProductoFormPage'
import ProveedoresPage from './pages/ProveedoresPage'
import VentasPage from './pages/VentasPage'
import ComprasPage from './pages/ComprasPage'
import FacturasPage from './pages/FacturasPage'
import PagosPage from './pages/PagosPage'
import UsuariosPage from './pages/UsuariosPage'
import ReportesPage from './pages/ReportesPage'

function WithNavbar() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="app-wrapper admin-layout">
      <Navbar />
      <main className="main-content admin-main">
        <Outlet />
      </main>
      <footer className="site-footer admin-footer">
        <div className="site-footer-inner">
          <p>{`© ${currentYear} Bebidas y Abarrotes S.A.`}</p>
          <p>Área administrativa para colaboradores autorizados.</p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/productos" element={<LandingPage />} />
      <Route path="/bebidas" element={<LandingPage />} />
      <Route path="/ofertas" element={<LandingPage />} />
      <Route path="/contacto" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<WithNavbar />}>
          <Route path="/dashboard" element={<Navigate to="/clientes" replace />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/nuevo" element={<ClienteFormPage />} />
          <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
          <Route path="/productos-admin" element={<ProductosPage />} />
          <Route path="/productos-admin/nuevo" element={<ProductoFormPage />} />
          <Route path="/productos-admin/editar/:id" element={<ProductoFormPage />} />
          <Route path="/inventario" element={<Navigate to="/productos-admin" replace />} />
          <Route path="/productos/nuevo" element={<Navigate to="/productos-admin/nuevo" replace />} />
          <Route path="/productos/editar/:id" element={<ProductoFormPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/compras" element={<ComprasPage />} />
          <Route path="/facturas" element={<FacturasPage />} />
          <Route path="/pagos" element={<PagosPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
