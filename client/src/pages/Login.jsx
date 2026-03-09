import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    
    setIsLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ padding: '6rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Log in to discover and collect premium Indian art.</p>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Email Address</label>
            <input 
              type="email" 
              className="input-field"
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Password</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="login-terms" 
              checked={acceptedTerms} 
              onChange={(e) => setAcceptedTerms(e.target.checked)} 
              style={{ marginTop: '0.2rem', accentColor: '#7c3aed', cursor: 'pointer' }}
            />
            <label htmlFor="login-terms" style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4', cursor: 'pointer' }}>
              I agree to the Terms & Conditions. Artists acknowledge that CanvasFlow takes a <strong>10% commission</strong> on sales.
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading || !acceptedTerms}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#c084fc', fontWeight: 'bold' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
