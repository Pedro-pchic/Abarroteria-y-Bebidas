import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="landing-hero landing-shell" id="inicio">
      <div className="landing-hero-copy">
        <span className="landing-kicker">Bebidas y Abarrotes S.A.</span>
        <h1>Todo para tu tienda y hogar en un solo lugar</h1>
        <p>
          Encuentra bebidas, abarrotes, productos basicos y promociones disponibles
          para tu negocio o familia.
        </p>

        <div className="landing-actions">
          <Link to="/productos" className="landing-button">
            Ver productos
          </Link>
          <Link to="/ofertas" className="landing-button landing-button-secondary">
            Ver ofertas
          </Link>
          <Link to="/login" className="landing-button landing-button-outline">
            Acceso al Sistema
          </Link>
        </div>
      </div>

      <div className="store-preview" aria-hidden="true">
        <div className="store-shelf shelf-top">
          <span className="bottle bottle-red" />
          <span className="bottle bottle-blue" />
          <span className="box box-green" />
          <span className="box box-yellow" />
        </div>
        <div className="store-shelf shelf-middle">
          <span className="bag bag-rice">Arroz</span>
          <span className="bag bag-beans">Frijol</span>
          <span className="can can-oil">Aceite</span>
        </div>
        <div className="store-counter">
          <strong>Promos</strong>
          <span>Combos y productos basicos</span>
        </div>
      </div>
    </section>
  )
}
