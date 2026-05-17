import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'
import Hero from '../components/Hero'
import LandingNavbar from '../components/LandingNavbar'
import '../styles/landing.css'

const features = [
  {
    icon: 'CL',
    title: 'Gestión de clientes',
    description: 'Centraliza datos, historial y seguimiento comercial en un solo lugar.',
  },
  {
    icon: 'IN',
    title: 'Inventario',
    description: 'Monitorea existencias, movimientos y disponibilidad con mayor claridad.',
  },
  {
    icon: 'VT',
    title: 'Ventas',
    description: 'Controla operaciones diarias y conserva una lectura ordenada del negocio.',
  },
  {
    icon: 'PR',
    title: 'Productos',
    description: 'Administra catálogo, precios y referencias de forma consistente.',
  },
  {
    icon: 'US',
    title: 'Usuarios',
    description: 'Gestiona accesos y responsabilidades con una estructura más segura.',
  },
  {
    icon: 'RP',
    title: 'Reportes',
    description: 'Convierte la operación en información útil para decidir mejor.',
  },
]

const benefits = [
  'Control centralizado',
  'Mayor productividad',
  'Seguridad de datos',
  'Acceso rápido',
  'Escalabilidad',
]

const stats = [
  { value: '500+', label: 'Productos' },
  { value: '1000+', label: 'Ventas' },
  { value: '250+', label: 'Clientes' },
  { value: '99%', label: 'Disponibilidad' },
]

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingNavbar />
      <main>
        <Hero />

        <section className="landing-section landing-shell" id="caracteristicas">
          <div className="section-heading">
            <span>Características</span>
            <h2>Una operación conectada, no una colección de pantallas sueltas.</h2>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="landing-section landing-shell benefits-section" id="modulos">
          <div className="section-heading">
            <span>Beneficios</span>
            <h2>La administración gana ritmo cuando la información deja de dispersarse.</h2>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <div key={benefit} className="benefit-pill">
                {benefit}
              </div>
            ))}
          </div>
        </section>

        <section className="landing-shell stats-grid" aria-label="Estadísticas">
          {stats.map(({ value, label }) => (
            <article key={label} className="stat-card">
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        <section className="landing-shell testimonial">
          <p>
            “Una plataforma clara reduce fricción operativa y deja más energía para
            atender el negocio.”
          </p>
        </section>

        <section className="landing-shell final-cta">
          <div>
            <span>Empieza hoy</span>
            <h2>Comienza a gestionar tu negocio de forma inteligente</h2>
          </div>
          <Link to="/login" className="landing-button">
            Ingresar al Sistema
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
