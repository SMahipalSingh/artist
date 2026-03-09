import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/explore?search=${keyword}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          <span style={{ color: '#7c3aed' }}>Canvas</span>Flow
        </Link>
        <Link to="/">Home</Link>
        <Link to="/explore">Explore Art</Link>
        <Link to="/pricing">Pricing</Link>
      </div>

      <div style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search artworks, categories..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </form>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span style={{ color: '#94a3b8' }}>Hi, {user.name}</span>
            {user.role === 'admin' && <Link to="/admin" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Admin</Link>}
            {user.role === 'artist' && <Link to="/artist-dashboard" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Dashboard</Link>}
            {user.role === 'collector' && <Link to="/collector-dashboard" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Dashboard</Link>}
            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: '#f8fafc', padding: '0.4rem 1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Log in</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
