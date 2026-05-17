import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="landing-hero landing-shell" id="inicio">
      <div className="landing-hero-copy">
        <span className="landing-kicker">Bebidas y Abarrotes S.A.</span>
        <h1>Sistema de Gestión Integral</h1>
        <p>
          Optimiza la administración de inventario, ventas, clientes y productos
          para Bebidas y Abarrotes S.A.
        </p>

        <div className="landing-actions">
          <a href="#caracteristicas" className="landing-button">
            Comenzar
          </a>
          <Link to="/login" className="landing-button landing-button-secondary">
            Iniciar Sesión
          </Link>
        </div>
      </div>

      <div className="dashboard-preview" aria-hidden="true">
        <div className="dashboard-preview-top">
          <span />
          <span />
          <span />
        </div>
        <div className="dashboard-preview-grid">
          <div className="metric metric-primary">
            <small>Inventario</small>
            <strong>500+</strong>
          </div>
          <div className="metric">
            <small>Ventas</small>
            <strong>1,000+</strong>
          </div>
          <div className="chart-card">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="table-card">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}
