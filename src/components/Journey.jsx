import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap, Award, Code, Rocket, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import './Journey.css';

const ICONS = {
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  award: Award,
  code: Code,
  rocket: Rocket,
  'book-open': BookOpen,
};

function JourneySkeleton() {
  return (
    <div className="journey__timeline">
      <div className="journey__line" />

      {[1, 2, 3, 4].map((item, i) => (
        <div
          key={i}
          className={`journey__item ${i % 2 === 0 ? 'journey__item--left' : 'journey__item--right'}`}
        >
          {/* Dot skeleton */}
          <div className="skeleton skeleton--circle" style={{ width: 36, height: 36, position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }} />

          {/* Card skeleton */}
          <div
            className="skeleton skeleton--card"
            style={{
              padding: 'var(--space-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {/* Header: type badge + date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton skeleton--rounded" style={{ width: 80, height: 24 }} />
              <div className="skeleton skeleton--rounded" style={{ width: 120, height: 18 }} />
            </div>

            {/* Title */}
            <div className="skeleton skeleton-text--lg" style={{ width: '75%' }} />

            {/* Organization */}
            <div className="skeleton skeleton-text" style={{ width: '50%' }} />

            {/* Location */}
            <div className="skeleton skeleton-text--sm" style={{ width: '40%' }} />

            {/* Description */}
            <div>
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: '90%' }} />
            </div>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="skeleton skeleton-text" style={{ width: '85%' }} />
              <div className="skeleton skeleton-text" style={{ width: '70%' }} />
              <div className="skeleton skeleton-text" style={{ width: '78%' }} />
            </div>

            {/* Tech tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="skeleton skeleton--rounded" style={{ width: 55 + Math.random() * 30, height: 26 }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Journey() {
  const [journey, setJourney] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    api.getJourney()
      .then(data => {
        setJourney(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="section journey" id="journey" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Career Path</span>
          <h2 className="section-title">Professional Journey</h2>
          <p className="section-subtitle">
            A timeline of growth, leadership, and impactful contributions.
          </p>
        </div>

        {isLoading ? (
          <JourneySkeleton />
        ) : (
          <div className="journey__timeline">
            <div className="journey__line" />

            {journey.map((item, i) => {
              const Icon = ICONS[item.icon_name] || Briefcase;
              const isWork = item.type === 'work';

              return (
                <motion.div
                  key={item.id}
                  className={`journey__item ${i % 2 === 0 ? 'journey__item--left' : 'journey__item--right'}`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={`journey__dot ${isWork ? 'journey__dot--work' : 'journey__dot--edu'}`}>
                    <Icon size={16} />
                  </div>

                  <div className="journey__card glass-card">
                    <div className="journey__card-header">
                      <span className={`journey__type ${isWork ? 'journey__type--work' : 'journey__type--edu'}`}>
                        {isWork ? '💼 Work' : '🎓 Education'}
                      </span>
                      <span className="journey__date">
                        {item.start_date} — {item.end_date || 'Present'}
                      </span>
                    </div>

                    <h3 className="journey__title">{item.title}</h3>

                    {item.organization && (
                      <p className="journey__org">{item.organization}</p>
                    )}

                    {item.location && (
                      <p className="journey__location">📍 {item.location}</p>
                    )}

                    {item.description && (
                      <p className="journey__desc">{item.description}</p>
                    )}

                    {item.highlights?.length > 0 && (
                      <ul className="journey__highlights">
                        {item.highlights.map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                      </ul>
                    )}

                    {item.tech_used?.length > 0 && (
                      <div className="journey__tech">
                        {item.tech_used.map(t => (
                          <span key={t} className="tech-tag">{t}</span>
                        ))}
                      </div>
                    )}

                    {!item.end_date && isWork && (
                      <div className="journey__current">
                        <span className="journey__current-dot" />
                        Currently Working Here
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
