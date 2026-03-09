import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArtworkCard from '../components/ArtworkCard';

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const { data } = await axios.get('/api/artworks');
        setArtworks(data);
      } catch (error) {
        console.error('Error fetching artworks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  return (
    <div>
      {/* Hero Section matching the Reference Site */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', letterSpacing: '-1px', fontWeight: 'bold' }}>
          CanvasFlow
        </h1>
        <h2 style={{ fontSize: '2rem', fontWeight: 'normal', color: '#c084fc', marginBottom: '2rem' }}>
          Exclusively Original Art
        </h2>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: '1.6' }}>
          CanvasFlow connects art enthusiasts with independent artists from across the globe. We showcase a diverse range of original wall art, from paintings and mixed media to digital art—always original, one of a kind artworks.
        </p>
        <Link to="/explore" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>Explore Original Art</Link>
      </section>

      {/* Info Split Section matching the Reference Site */}
      <section className="container" style={{ padding: '4rem 2rem 6rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          
          <div className="glass-panel" style={{ padding: '4rem 3rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>For the art lover</h3>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              CanvasFlow presents a variety of original art, including paintings, mixed media, and digital masterpieces. Our artists explore a diverse range of styles and themes, ensuring that there's something for every taste.
            </p>
            <Link to="/explore" className="btn btn-outline" style={{ display: 'inline-block' }}>Discover Art</Link>
          </div>

          <div className="glass-panel" style={{ padding: '4rem 3rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>For the artist</h3>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Becoming an artist on CanvasFlow provides you with a platform to showcase your work to a wider audience, connect with art lovers worldwide, and gain exposure to new income opportunities.
            </p>
            <Link to="/pricing" className="btn btn-outline" style={{ display: 'inline-block' }}>Join as Artist</Link>
          </div>

        </div>
      </section>

      {/* Featured Artworks Grid */}
      <section className="container" style={{ paddingBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Artworks</h2>
          <div style={{ width: '60px', height: '4px', background: '#c084fc', margin: '0 auto' }}></div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading masterpieces...</div>
        ) : artworks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>No artworks found</h3>
            <p className="text-muted">The gallery is currently empty.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        )}
      </section>
      
      {/* Footer integration */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '4rem 2rem', textAlign: 'center', background: 'rgba(0,0,0,0.4)' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}><span style={{ color: '#7c3aed' }}>Canvas</span>Flow</h3>
        <p className="text-muted">© 2026 CanvasFlow Marketplace. All rights reserved.</p>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>Legal Disclaimer: CanvasFlow connects Independent Artists with Collectors.</p>
      </footer>
    </div>
  );
};

export default Home;
