import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Journey from './components/Journey';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import { api } from './services/api';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <>
      {/* Background effects */}
      <div className="bg-particles">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>
      <div className="bg-grid" />

      {/* Content */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero profile={profile} />
        <Projects />
        <Skills />
        <Journey />
        <Contact />
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;
