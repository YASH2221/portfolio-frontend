import { Heart, Code2 } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="gradient-divider" />
        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <Code2 size={18} />
              </div>
              <span className="footer__logo-text">
                Yash<span className="footer__logo-accent">.dev</span>
              </span>
            </div>
            <p className="footer__tagline">
              Building the future, one line of code at a time.
            </p>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Yash Patidar. Built with{' '}
              <Heart size={14} className="footer__heart" />{' '}
              using React + FastAPI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
