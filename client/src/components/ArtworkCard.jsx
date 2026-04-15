import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Download } from 'lucide-react';

const ArtworkCard = ({ artwork }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', transition: 'opacity 0.2s', cursor: 'pointer' }}
         onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
         onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
         
      <Link to={`/artwork/${artwork._id}`} style={{ display: 'block', width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#e2e8f0', marginBottom: '1rem' }}>
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </Link>

      <div style={{ padding: '0 0.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.2rem 0', color: '#f8fafc', fontWeight: 'bold' }}>
          <Link to={`/artwork/${artwork._id}`} style={{ color: 'inherit' }}>{artwork.title}</Link>
        </h3>
        <p className="text-muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{artwork.artist_id?.name || 'Unknown Artist'}</p>
        <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: '#cbd5e1' }}>
          ₹{artwork.price}
        </span>
      </div>
    </div>
  );
};

export default ArtworkCard;
