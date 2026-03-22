import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { UploadCloud, Image as ImageIcon, Briefcase, PlusCircle, CheckCircle } from 'lucide-react';

const UploadArtwork = () => {
  const { user } = useContext(AuthContext);
  
  // Upload Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('image', image);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post('/api/artworks', formData, config);
      
      setUploadSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setTags('');
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading artwork');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <img src={user?.profileImage} alt={user?.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Creator Studio</h1>
          <p className="text-muted" style={{ margin: 0 }}>Manage your portfolio, {user?.name}.</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <UploadCloud size={28} color="#7c3aed" />
            <h2 style={{ margin: 0 }}>Upload New Artwork</h2>
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px' }}>{error}</div>}
          {uploadSuccess && <div style={{ color: '#10b981', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Artwork Published Successfully!</div>}

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Title</label>
                <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Neon Dreams" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Category</label>
                <select 
                  className="input-field" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  required
                  style={{ appearance: 'none' }}
                >
                  <option value="" disabled>Select a category...</option>
                  <option value="Portrait" style={{ background: '#0f0a1c' }}>Portrait</option>
                  <option value="Spiritual" style={{ background: '#0f0a1c' }}>Spiritual</option>
                  <option value="Nature" style={{ background: '#0f0a1c' }}>Nature</option>
                  <option value="Sketch" style={{ background: '#0f0a1c' }}>Sketch</option>
                  <option value="Painting" style={{ background: '#0f0a1c' }}>Painting</option>
                  <option value="Abstract" style={{ background: '#0f0a1c' }}>Abstract</option>
                  <option value="Photography" style={{ background: '#0f0a1c' }}>Photography</option>
                  <option value="3D Render" style={{ background: '#0f0a1c' }}>3D Render</option>
                  <option value="Concept Art" style={{ background: '#0f0a1c' }}>Concept Art</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Description</label>
              <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Tell the story behind your art..." rows="4" style={{ resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Price (₹)</label>
                <input type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="4999" min="0" step="0.01" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Tags (comma separated)</label>
                <input type="text" className="input-field" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="neon, city, future" />
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}>Artwork Image (High-Res Required)</label>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Upload your best quality image. We will automatically compress it for the public gallery display, while keeping the original file for premium downloads.</p>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" required style={{ width: '100%', color: '#94a3b8' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }} disabled={isUploading}>
              {isUploading ? 'Uploading to Server...' : <><PlusCircle size={20} /> Publish to Marketplace</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadArtwork;
