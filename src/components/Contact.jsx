import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, Mail, Phone, MapPin, ExternalLink, GitBranch, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.sendContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'yashpatidar2203@gmail.com', href: 'mailto:yashpatidar2203@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 6260859544', href: 'tel:+916260859544' },
    { icon: MapPin, label: 'Location', value: 'Indore, MP, India', href: null },
  ];

  const socials = [
    { icon: ExternalLink, href: 'https://linkedin.com/in/yash-patidar-288412230', label: 'LinkedIn' },
    { icon: GitBranch, href: 'https://github.com/yashpatidar', label: 'GitHub' },
  ];

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-subtitle">
            Have a project in mind? I'd love to hear about it. Let's build something amazing together.
          </p>
        </div>

        <div className="contact__grid">
          {/* Contact Info */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="contact__info-cards">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="contact__info-card glass-card">
                    <div className="contact__info-icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="contact__info-label">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="contact__info-value">{item.value}</a>
                      ) : (
                        <span className="contact__info-value">{item.value}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="contact__socials">
              <p className="contact__socials-label">Find me on</p>
              <div className="contact__socials-links">
                {socials.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact__social-link"
                      aria-label={s.label}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="contact__form glass-card"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="contact__field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="contact__field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="contact__field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            {status === 'success' && (
              <div className="contact__alert contact__alert--success">
                <CheckCircle size={16} />
                <span>Message sent successfully! I'll get back to you soon.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="contact__alert contact__alert--error">
                <AlertCircle size={16} />
                <span>Something went wrong. Please try again or email me directly.</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary contact__submit" disabled={loading}>
              <Send size={18} />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
