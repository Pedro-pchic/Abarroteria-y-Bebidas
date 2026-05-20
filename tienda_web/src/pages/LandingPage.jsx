import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import LandingNavbar from '../components/LandingNavbar'
import '../styles/landing.css'

const categories = [
  {
    icon: 'BD',
    title: 'Bebidas',
    description: 'Gaseosas, agua pura, jugos y bebidas familiares para consumo o reventa.',
  },
  {
    icon: 'AB',
    title: 'Abarrotes',
    description: 'Productos de despensa para abastecer tu casa, negocio o tienda de barrio.',
  },
  {
    icon: 'SN',
    title: 'Snacks',
    description: 'Galletas, frituras y productos listos para complementar tu mostrador.',
  },
  {
    icon: 'LM',
    title: 'Limpieza',
    description: 'Articulos esenciales para mantener espacios limpios y bien surtidos.',
  },
  {
    icon: 'PB',
    title: 'Productos basicos',
    description: 'Arroz, frijol, azucar, aceite y otros productos de alta rotacion.',
  },
  {
    icon: 'OF',
    title: 'Promociones',
    description: 'Combos y precios especiales disponibles por temporada.',
  },
]

const products = [
  { name: 'Coca-Cola 2L', category: 'Bebidas', price: 'Q14.50', tag: 'Disponible' },
  { name: 'Pepsi 2L', category: 'Bebidas', price: 'Q13.75', tag: 'Oferta' },
  { name: 'Agua pura', category: 'Bebidas', price: 'Q5.00', tag: 'Disponible' },
  { name: 'Arroz', category: 'Productos basicos', price: 'Q7.25', tag: 'Disponible' },
  { name: 'Frijol', category: 'Productos basicos', price: 'Q8.50', tag: 'Disponible' },
  { name: 'Azucar', category: 'Productos basicos', price: 'Q6.75', tag: 'Oferta' },
  { name: 'Aceite', category: 'Abarrotes', price: 'Q22.00', tag: 'Disponible' },
  { name: 'Galletas', category: 'Snacks', price: 'Q4.50', tag: 'Oferta' },
]

const offers = [
  {
    title: 'Combo bebidas familiares',
    detail: 'Gaseosas, agua pura y jugos para reuniones o tiendas con alta rotacion.',
    price: 'Desde Q89.00',
  },
  {
    title: 'Canasta basica',
    detail: 'Arroz, frijol, azucar, aceite y productos esenciales para el hogar.',
    price: 'Desde Q129.00',
  },
  {
    title: 'Snacks para negocio',
    detail: 'Surtido de galletas y botanas para mostradores, kioscos y tiendas.',
    price: 'Desde Q75.00',
  },
  {
    title: 'Productos de limpieza',
    detail: 'Paquete de articulos de limpieza para negocio, oficina o casa.',
    price: 'Desde Q64.00',
  },
]

const sectionByPath = {
  '/productos': 'productos',
  '/bebidas': 'bebidas',
  '/ofertas': 'ofertas',
  '/contacto': 'contacto',
}

export default function LandingPage() {
  const { pathname } = useLocation()

  useEffect(() => {
    const sectionId = sectionByPath[pathname]
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [pathname])

  return (
    <div className="landing-page">
      <LandingNavbar />
      <main>
        <Hero />

        <section className="landing-section landing-shell" id="bebidas">
          <div className="section-heading">
            <span>Categorias</span>
            <h2>Abastece tu tienda o tu hogar con productos de consumo diario.</h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.title} className="category-card">
                <span className="category-icon" aria-hidden="true">{category.icon}</span>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-shell" id="productos">
          <div className="section-heading section-heading-row">
            <div>
              <span>Productos destacados</span>
              <h2>Catalogo rapido con precios simulados para consulta.</h2>
            </div>
            <Link to="/contacto" className="landing-button landing-button-secondary">
              Contactar tienda
            </Link>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article key={product.name} className="product-card">
                <div className="product-image" aria-hidden="true">
                  <span>{product.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="product-card-body">
                  <div className="product-card-top">
                    <span className={`product-tag${product.tag === 'Oferta' ? ' product-tag-offer' : ''}`}>
                      {product.tag}
                    </span>
                    <strong>{product.price}</strong>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <Link to="/contacto" className="product-action">
                    Consultar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section offers-band" id="ofertas">
          <div className="landing-shell">
            <div className="section-heading">
              <span>Ofertas</span>
              <h2>Promociones pensadas para familias y pequenos negocios.</h2>
            </div>

            <div className="offer-grid">
              {offers.map((offer) => (
                <article key={offer.title} className="offer-card">
                  <h3>{offer.title}</h3>
                  <p>{offer.detail}</p>
                  <strong>{offer.price}</strong>
                  <Link to="/contacto">Consultar promocion</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-shell contact-section" id="contacto">
          <div className="contact-copy">
            <span className="landing-kicker">Contacto</span>
            <h2>Consulta disponibilidad, precios por volumen o promociones activas.</h2>
            <p>
              Atendemos pedidos de familias, tiendas y negocios que necesitan productos
              confiables con una respuesta clara.
            </p>
          </div>

          <div className="contact-panel">
            <div>
              <span>Direccion</span>
              <strong>12 Avenida 8-45, Zona 3, Ciudad de Guatemala</strong>
            </div>
            <div>
              <span>Telefono</span>
              <strong>+502 2234 5678</strong>
            </div>
            <div>
              <span>Horario</span>
              <strong>Lunes a sabado, 8:00 a 18:00 horas</strong>
            </div>
            <p>Escribenos para confirmar existencias, preparar combos o resolver dudas sobre productos.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
