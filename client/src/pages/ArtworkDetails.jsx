import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Download, Share2, ShieldCheck, Maximize2 } from 'lucide-react';

const ArtworkDetails = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const { data } = await axios.get(`/api/artworks/${id}`);
        setArtwork(data);
      } catch (error) {
        console.error('Error fetching artwork details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>Loading Masterpiece...</div>;
  if (!artwork) return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#ef4444' }}>Artwork not found.</div>;

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left Column: Image Area */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
            />
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div style={{ flex: '1 1 400px', position: 'sticky', top: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>{artwork.title}</h1>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '1.5rem' }}>{artwork.artist?.name || 'Unknown Artist'}</p>
            </div>
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('URL copied to clipboard!');
              }}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
          
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#f8fafc' }}>
            ₹{artwork.price}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <Link to={`/checkout/${artwork._id}`} className="btn btn-primary" style={{ padding: '1rem', textAlign: 'center', fontSize: '1.1rem' }}>
              Buy Physical Print
            </Link>
            
            <button 
              className="btn btn-outline" 
              style={{ padding: '1rem', textAlign: 'center', fontSize: '1.1rem' }}
              onClick={async () => {
                const user = JSON.parse(localStorage.getItem('userInfo'));
                if (!user) {
                  alert('Please login to download');
                  return;
                }
                
                const isPremium = ['pro', 'studio'].includes(user.subscriptionPlan);
                const isPrivileged = ['admin', 'artist'].includes(user.role);
                
                if (!isPremium && !isPrivileged) {
                  alert("A Premium Subscription is required to download Master files.");
                  return;
                }

                try {
                  const response = await axios.get(`/api/artworks/${artwork._id}/download`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                    responseType: 'blob'
                  });
                  
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `${artwork.title.replace(/\s+/g, '_')}_CanvasFlow.pdf`);
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                  // Removed visual download counter to align with simplified DB
                } catch (error) {
                  console.error("Download failed", error);
                  alert("Failed to download file.");
                }
              }}
            >
              Download Master PDF
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#cbd5e1', fontSize: '1.1rem' }}>Product Details</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><strong style={{ color: '#f8fafc', width: '120px', display: 'inline-block' }}>Category:</strong> {artwork.category}</li>
              <li><strong style={{ color: '#f8fafc', width: '120px', display: 'inline-block' }}>Medium:</strong> Digital Master</li>
              <li><strong style={{ color: '#f8fafc', width: '120px', display: 'inline-block' }}>Delivery:</strong> Physical Print or PDF</li>
            </ul>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', marginTop: '2rem' }}>
             <h4 style={{ marginBottom: '1rem', color: '#cbd5e1', fontSize: '1.1rem' }}>About this piece</h4>
             <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>{artwork.description || 'No description provided by the artist.'}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails;
