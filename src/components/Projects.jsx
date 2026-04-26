import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, GitBranch, ChevronRight, X, Layers } from 'lucide-react';
import { api } from '../services/api';
import './Projects.css';

const CATEGORIES = [
  { key: '', label: 'All Projects' },
  { key: 'enterprise', label: 'Enterprise' },
  { key: 'ai_ml', label: 'AI / ML' },
  { key: 'web', label: 'Web Apps' },
  { key: 'mobile', label: 'Mobile' },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  const filtered = filter
    ? projects.filter(p => p.category === filter)
    : projects;

  return (
    <section className="section projects" id="projects" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A selection of projects showcasing my expertise across enterprise systems,
            AI platforms, and modern web applications.
          </p>
        </div>

        {/* Filter chips */}
        <div className="projects__filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`projects__filter ${filter === cat.key ? 'projects__filter--active' : ''}`}
              onClick={() => setFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <motion.div className="projects__grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                className="projects__card glass-card"
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => setSelected(project)}
              >
                <div className="projects__card-header">
                  <div className="projects__card-icon">
                    <Layers size={24} />
                  </div>
                  {project.featured && (
                    <span className="projects__featured-badge">Featured</span>
                  )}
                </div>
                
                <h3 className="projects__card-title">{project.title}</h3>
                <p className="projects__card-desc">{project.short_description}</p>
                
                <div className="projects__card-tags">
                  {project.tech_stack?.slice(0, 4).map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                  {project.tech_stack?.length > 4 && (
                    <span className="tech-tag">+{project.tech_stack.length - 4}</span>
                  )}
                </div>

                <div className="projects__card-footer">
                  <span className="projects__card-more">
                    View Details <ChevronRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="projects__modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="projects__modal"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="projects__modal-close" onClick={() => setSelected(null)}>
                <X size={20} />
              </button>

              <div className="projects__modal-content">
                <div className="projects__modal-header">
                  <span className="section-label">{selected.category}</span>
                  <h3 className="projects__modal-title">{selected.title}</h3>
                </div>

                {selected.problem_statement && (
                  <div className="projects__modal-section">
                    <h4>🎯 Problem Statement</h4>
                    <p>{selected.problem_statement}</p>
                  </div>
                )}

                <div className="projects__modal-section">
                  <h4>💡 Solution</h4>
                  <p>{selected.full_description}</p>
                </div>

                {selected.challenges && (
                  <div className="projects__modal-section">
                    <h4>⚡ Key Challenges</h4>
                    <p>{selected.challenges}</p>
                  </div>
                )}

                <div className="projects__modal-section">
                  <h4>🛠 Tech Stack</h4>
                  <div className="projects__modal-tags">
                    {selected.tech_stack?.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="projects__modal-actions">
                  {selected.live_url && (
                    <a href={selected.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {selected.github_url && (
                    <a href={selected.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <GitBranch size={16} /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
