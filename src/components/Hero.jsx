import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import './Hero.css';

const TITLES = [
  'Senior Full Stack Developer',
  'AI/ML Engineer',
  'Team Lead',
  'Cloud Architect',
  'Problem Solver',
];

export default function Hero({ profile }) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    let timeout;

    if (!isDeleting && displayText === currentTitle) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentTitle.slice(0, displayText.length - 1)
            : currentTitle.slice(0, displayText.length + 1)
        );
      }, isDeleting ? 40 : 80);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  const stats = [
    { value: '4+', label: 'Years Experience' },
    { value: '15+', label: 'Projects Delivered' },
    { value: '30+', label: 'Technologies' },
  ];

  return (
    <section className="hero" id="home">
      <div className="hero__content container">
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__badge">
            <Sparkles size={14} />
            <span>Available for opportunities</span>
          </div>

          <h1 className="hero__name">
            Hi, I'm <span className="hero__name-accent">Yash Patidar</span>
          </h1>

          <div className="hero__title-wrapper">
            <span className="hero__title">
              {displayText}
              <span className="hero__cursor">|</span>
            </span>
          </div>

          <p className="hero__bio">
            Results-driven Software Engineer crafting scalable web applications,
            mobile apps, and AI-powered solutions. Expertise in microservices architecture,
            cloud deployment, and generative AI integration.
          </p>

          <div className="hero__location">
            <MapPin size={16} />
            <span>Indore, Madhya Pradesh, India</span>
          </div>

          <div className="hero__actions">
            <a href="#contact" className="btn btn-primary">
              <MessageCircle size={18} />
              Let's Talk
            </a>
            <a href="/Yash_Resume.pdf" download className="btn btn-secondary">
              <Download size={18} />
              Download Resume
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__avatar-ring">
            <div className="hero__avatar-ring-inner">
              <div className="hero__avatar-placeholder">
                <span>YP</span>
              </div>
            </div>
          </div>
          
          {/* Floating tech badges */}
          <div className="hero__floating-badge hero__floating-badge--1">⚛️ React</div>
          <div className="hero__floating-badge hero__floating-badge--2">🐍 Python</div>
          <div className="hero__floating-badge hero__floating-badge--3">🤖 AI/ML</div>
          <div className="hero__floating-badge hero__floating-badge--4">☁️ Cloud</div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        className="hero__stats container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {stats.map((stat, i) => (
          <div key={i} className="hero__stat">
            <span className="hero__stat-value">{stat.value}</span>
            <span className="hero__stat-label">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#projects"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span>Scroll to explore</span>
        <ChevronDown size={18} className="hero__scroll-icon" />
      </motion.a>
    </section>
  );
}
