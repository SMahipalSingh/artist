import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const categories = ['Madhubani', 'Warli', 'Tanjore', 'Pichwai', 'Mughal Miniature', 'Gond', 'Kalighat', 'Contemporary'];

const UploadArt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(
        '/api/artworks',
        { title, description, price: Number(price), category, image },
        config
      );

      navigate('/artist');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading artwork');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16" style={{ maxWidth: '600px' }}>
      <div className="auth-card" style={{ maxWidth: '100%', padding: '3rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Upload Artwork</h2>
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Add a new piece to your portfolio. Please provide a high-quality image URL.</p>

        {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.8rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Artwork Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Divine Radha Krishna" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows="4" 
              style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--rounded-md)', fontFamily: 'inherit' }}
              placeholder="Describe the inspiration, medium, and size..."
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="15000" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://images.unsplash.com/photo-..." />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>For now, please provide a direct URL to an image hosted online (e.g. Unsplash, Imgur).</span>
          </div>

          <button type="submit" className="btn-auth" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Uploading...' : 'Publish Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadArt;
