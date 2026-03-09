import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import ArtworkCard from '../components/ArtworkCard';

const Explore = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Parse custom useQuery
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const url = searchQuery ? `/api/artworks?keyword=${searchQuery}` : '/api/artworks';
        const { data } = await axios.get(url);
        // Ensure data is array (fallback if backend returns a paginated object or error object)
        setArtworks(Array.isArray(data) ? data : (data.artworks || []));
      } catch (error) {
        console.error('Error fetching artworks', error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [searchQuery]);

  return (
    <div className="container" style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>All Products</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Browse our current selection of original wall art. The Artists Marketplace works with Artists & together we bring Exclusively Original Art to collectors.</p>
      </div>

      <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Sidebar Filters */}
        <div style={{ flex: '1 1 250px', position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Browse</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link to="/explore" style={{ color: !searchQuery ? '#c084fc' : '#cbd5e1', fontWeight: !searchQuery ? 'bold' : 'normal' }}>All Products</Link></li>
            <li><Link to="/explore?search=painting" style={{ color: searchQuery === 'painting' ? '#c084fc' : '#cbd5e1' }}>Painting</Link></li>
            <li><Link to="/explore?search=mixed media" style={{ color: searchQuery === 'mixed media' ? '#c084fc' : '#cbd5e1' }}>Mixed Media</Link></li>
            <li><Link to="/explore?search=photography" style={{ color: searchQuery === 'photography' ? '#c084fc' : '#cbd5e1' }}>Photography</Link></li>
            <li><Link to="/explore?search=digital" style={{ color: searchQuery === 'digital' ? '#c084fc' : '#cbd5e1' }}>Digital Art</Link></li>
            <li><Link to="/explore?search=portrait" style={{ color: searchQuery === 'portrait' ? '#c084fc' : '#cbd5e1' }}>Portrait</Link></li>
          </ul>
        </div>

        {/* Main Grid Area */}
        <div style={{ flex: '3 1 400px', minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading gallery...</div>
          ) : !Array.isArray(artworks) || artworks.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem' }}>No artworks yet.</h3>
              <p className="text-muted">Check back soon for new additions.</p>
            </div>
          ) : (
            <div className="grid-auto">
              {Array.isArray(artworks) && artworks.map((artwork, idx) => {
                if (!artwork || !artwork._id) return null;
                return <ArtworkCard key={artwork._id || idx} artwork={artwork} />;
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Explore;
