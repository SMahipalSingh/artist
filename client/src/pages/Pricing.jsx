import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Pricing = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processingPlan, setProcessingPlan] = useState(null);
  
  const handleUpgrade = (planTier, planPrice) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const orderData = {
      isSubscription: true,
      plan: planTier,
      totalPrice: planPrice,
      token: user.token
    };

    // Route to the dedicated Razorpay Mock Page
    navigate('/payment-gateway', { state: orderData });
  };

  return (
    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Simple, <span style={{ color: '#7c3aed' }}>transparent</span> pricing.</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem' }}>Choose the perfect plan to grow your digital art collection or start your creative career.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        
        {/* Basic Plan */}
        <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f8fafc' }}>Collector Basic</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            ₹0<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', flex: 1, marginBottom: '2rem' }}>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Check size={20} color="#10b981" /> Browse high-res gallery</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Check size={20} color="#10b981" /> Save to personal collections</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#64748b' }}><Check size={20} color="#334155" /> <del>Download Master Files (PDF)</del></li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#64748b' }}><Check size={20} color="#334155" /> <del>Sell Artworks</del></li>
          </ul>
          <button className="btn btn-outline" style={{ width: '100%', padding: '1rem' }} disabled={user?.role === 'admin' || user?.subscriptionPlan === 'basic' || !user?.subscriptionPlan}>
            {user?.role === 'admin' ? 'Master Access' : user?.subscriptionPlan === 'basic' || !user?.subscriptionPlan ? 'Current Plan' : 'Get Started'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', border: '2px solid #7c3aed', transform: 'scale(1.05)', zIndex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)', padding: '0.4rem 1.5rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            MOST POPULAR
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f8fafc' }}>CanvasFlow Pro</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', color: '#c084fc' }}>
            ₹1,499<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', flex: 1, marginBottom: '2rem' }}>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Check size={20} color="#10b981" /> All Basic features</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Zap size={20} color="#fbbf24" /> Unlimited Master Downloads (PDF)</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Check size={20} color="#10b981" /> Commercial usage rights</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#64748b' }}><Check size={20} color="#334155" /> <del>Creator Studio Access</del></li>
          </ul>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem' }} 
            onClick={() => handleUpgrade('pro', 1499)}
            disabled={user?.role === 'admin' || user?.subscriptionPlan === 'pro' || user?.subscriptionPlan === 'studio'}
          >
            {user?.role === 'admin' ? 'Master Access' : user?.subscriptionPlan === 'pro' || user?.subscriptionPlan === 'studio' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Studio Plan */}
        <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f8fafc' }}>Studio Team</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            ₹6,999<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', flex: 1, marginBottom: '2rem' }}>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Star size={20} color="#fbbf24" /> Everything in Pro</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Check size={20} color="#10b981" /> Full Creator Studio Access</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Check size={20} color="#10b981" /> Sell Unlimited Artworks</li>
            <li style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', color: '#cbd5e1' }}><Check size={20} color="#10b981" /> 0% Platform Commission</li>
          </ul>
          <button 
            className="btn btn-outline" 
            style={{ width: '100%', padding: '1rem' }}
            onClick={() => handleUpgrade('studio', 6999)}
            disabled={user?.role === 'admin' || user?.subscriptionPlan === 'studio'}
          >
            {user?.role === 'admin' ? 'Master Access' : user?.subscriptionPlan === 'studio' ? 'Current Plan' : 'Get Studio Team'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
