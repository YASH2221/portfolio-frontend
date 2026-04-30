import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Layout, Server, Database, Cloud, Brain, Smartphone, Wrench, Grid } from 'lucide-react';
import { api } from '../services/api';
import './Skills.css';

const CATEGORY_META = {
  languages: { label: 'Languages', icon: Code2, color: '#f59e0b' },
  frontend: { label: 'Frontend', icon: Layout, color: '#3b82f6' },
  backend: { label: 'Backend', icon: Server, color: '#22c55e' },
  database: { label: 'Database', icon: Database, color: '#ef4444' },
  cloud: { label: 'Cloud & DevOps', icon: Cloud, color: '#8b5cf6' },
  ai_ml: { label: 'AI / ML', icon: Brain, color: '#06b6d4' },
  mobile: { label: 'Mobile', icon: Smartphone, color: '#ec4899' },
  tools: { label: 'Tools & Integrations', icon: Wrench, color: '#64748b' },
  other: { label: 'Architecture', icon: Grid, color: '#10b981' },
};

function SkillsSkeleton() {
  return (
    <>
      {/* Tab skeleton */}
      <div className="skills__tabs">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="skeleton skeleton--rounded"
            style={{ width: 90 + Math.random() * 50, height: 40 }}
          />
        ))}
      </div>

      {/* Skills grid skeleton */}
      <div className="skills__grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div
            key={i}
            className="skeleton skeleton--card"
            style={{
              padding: 'var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {/* Name + percent */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton" style={{ width: '55%', height: 16 }} />
              <div className="skeleton" style={{ width: 36, height: 16 }} />
            </div>

            {/* Progress bar */}
            <div className="skeleton" style={{ width: '100%', height: 8, borderRadius: 4 }} />

            {/* Experience */}
            <div className="skeleton skeleton-text--sm" style={{ width: 70 }} />
          </div>
        ))}
      </div>
    </>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    api.getSkills()
      .then(data => {
        setSkills(data);
        const categories = [...new Set(data.map(s => s.category))];
        if (categories.length) setActiveCategory(categories[0]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const categories = [...new Set(skills.map(s => s.category))];
  const filteredSkills = skills.filter(s => s.category === activeCategory);

  return (
    <section className="section skills" id="skills" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Expertise</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            A comprehensive toolkit built over 4+ years of professional development.
          </p>
        </div>

        {isLoading ? (
          <SkillsSkeleton />
        ) : (
          <>
            {/* Category tabs */}
            <div className="skills__tabs">
              {categories.map(cat => {
                const meta = CATEGORY_META[cat] || { label: cat, icon: Code2, color: '#7c3aed' };
                const Icon = meta.icon;
                return (
                  <button
                    key={cat}
                    className={`skills__tab ${activeCategory === cat ? 'skills__tab--active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    style={{ '--tab-color': meta.color }}
                  >
                    <Icon size={18} />
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Skills grid */}
            <div className="skills__grid">
              {filteredSkills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  className="skills__card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="skills__card-top">
                    <span className="skills__card-name">{skill.name}</span>
                    <span className="skills__card-percent">{skill.proficiency}%</span>
                  </div>

                  <div className="skills__bar-track">
                    <motion.div
                      className="skills__bar-fill"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.proficiency}%` } : {}}
                      transition={{ duration: 1, delay: i * 0.08 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: `linear-gradient(90deg, ${CATEGORY_META[skill.category]?.color || '#7c3aed'}, ${CATEGORY_META[skill.category]?.color || '#7c3aed'}88)`
                      }}
                    />
                  </div>

                  {skill.years_experience > 0 && (
                    <span className="skills__card-exp">
                      {skill.years_experience}+ years
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
