import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="landing-footer">
      <div className="landing-shell landing-footer-inner">
        <div>
          <strong>Bebidas y Abarrotes S.A.</strong>
          <p>Sistema de Gestion Integral para Bebidas y Abarrotes S.A.</p>
        </div>

        <div className="landing-footer-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/bebidas">Bebidas</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <p>© {currentYear} Bebidas y Abarrotes S.A.</p>
      </div>
    </footer>
  )
}
