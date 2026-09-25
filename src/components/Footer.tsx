import { ArrowRight, Camera, Globe2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { businessConfig } from '../config/business'
import { getWhatsAppUrl } from '../lib/whatsapp'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>{businessConfig.description}</p>
          <div className="footer__socials">
            {businessConfig.social.instagram && (
              <a href={businessConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Camera size={18} />
              </a>
            )}
            {businessConfig.social.facebook && (
              <a href={businessConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Globe2 size={18} />
              </a>
            )}
            <a
              href={getWhatsAppUrl('Hello Treadly, I need help choosing a tyre.')}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
        <div>
          <h3>Shop</h3>
          <Link to="/shop">All tyres</Link>
          <Link to="/shop?vehicleType=Passenger">Passenger tyres</Link>
          <Link to="/shop?vehicleType=SUV%20%26%204x4">SUV & 4x4 tyres</Link>
          <Link to="/brands">Our brands</Link>
        </div>
        <div>
          <h3>Company</h3>
          <Link to="/about">About Treadly</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/contact#fitment">Tyre fitment help</Link>
          <Link to="/admin">Shop admin</Link>
        </div>
        <div className="footer__contact">
          <h3>Talk to a tyre expert</h3>
          <a href={`tel:${businessConfig.phoneDisplay.replace(/\s/g, '')}`}>
            <Phone size={17} /> {businessConfig.phoneDisplay}
          </a>
          <a href={`mailto:${businessConfig.email}`}>
            <Mail size={17} /> {businessConfig.email}
          </a>
          <span><MapPin size={17} /> {businessConfig.address}</span>
          <a
            className="footer__whatsapp"
            href={getWhatsAppUrl('Hello Treadly, I would like help choosing the right tyre.')}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Start a WhatsApp chat <ArrowRight size={15} />
          </a>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {businessConfig.legalName}. All rights reserved.</p>
        <p>Secure ordering • Clear pricing • Nationwide delivery</p>
      </div>
    </footer>
  )
}
