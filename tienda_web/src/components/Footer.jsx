export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="landing-footer" id="contacto">
      <div className="landing-shell landing-footer-inner">
        <div>
          <strong>Sistema de Gestión Integral</strong>
          <p>Bebidas y Abarrotes S.A.</p>
        </div>

        <div className="landing-footer-links">
          <a href="#inicio">Inicio</a>
          <a href="#caracteristicas">Características</a>
          <a href="#modulos">Módulos</a>
        </div>

        <p>© {currentYear} Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
