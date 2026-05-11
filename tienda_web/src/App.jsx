import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
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
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>{`© ${currentYear} Tienda Central. Todos los derechos reservados.`}</p>
          <p>Contenido y diseno protegidos para uso exclusivo del proyecto.</p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<WithNavbar />}>
            <Route path="/" element={<Navigate to="/clientes" replace />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/nuevo" element={<ClienteFormPage />} />
            <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/nuevo" element={<ProductoFormPage />} />
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

        <Route path="*" element={<Navigate to="/clientes" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
