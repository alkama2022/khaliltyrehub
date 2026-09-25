import { Menu, MessageCircle, Phone, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { businessConfig } from '../config/business'
import { useCart } from '../context/CartContext'
import { getWhatsAppUrl } from '../lib/whatsapp'
import { Logo } from './Logo'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop Tyres', to: '/shop' },
  { label: 'Brands', to: '/brands' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <span className="topbar__delivery">
            <span className="topbar__dot" /> {businessConfig.deliveryNote}
          </span>
          <div className="topbar__contact">
            <a href={`tel:${businessConfig.phoneDisplay.replace(/\s/g, '')}`}>
              <Phone size={13} /> {businessConfig.phoneDisplay}
            </a>
            <a
              href={getWhatsAppUrl('Hello Treadly, I would like to ask about a tyre.')}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={13} /> WhatsApp us
            </a>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="container header__inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header__actions">
            <NavLink to="/cart" className="cart-link" aria-label={`Cart with ${itemCount} items`}>
              <ShoppingBag size={21} />
              <span className="cart-link__label">Cart</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>}
            </NavLink>
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="container" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/cart">
            Shopping cart {itemCount > 0 && <span className="mobile-nav__count">{itemCount}</span>}
          </NavLink>
        </nav>
      </div>
    </>
  )
}
