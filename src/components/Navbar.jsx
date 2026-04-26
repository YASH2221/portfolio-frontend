import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Code2 } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = NAV_LINKS.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a href="#home" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Code2 size={22} />
          </div>
          <span className="navbar__logo-text">
            Yash<span className="navbar__logo-accent">.dev</span>
          </span>
        </a>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`navbar__link ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              <span className="navbar__link-indicator" />
            </a>
          ))}
        </div>

        <div className="navbar__actions">
          <button
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href="#contact" className="btn btn-primary navbar__cta">
            Hire Me
          </a>

          <button
            className="navbar__mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
