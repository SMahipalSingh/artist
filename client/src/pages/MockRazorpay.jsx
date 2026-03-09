import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MockRazorpay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUserData } = useContext(AuthContext);
  const orderData = location.state;

  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!orderData) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Invalid Payment Session</h2>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginTop: '1rem' }}>Return Home</button>
      </div>
    );
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    // Simulate Network Delay for realism
    setTimeout(async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${orderData.token}` },
        };

        // Handle Subscription Upgrades differently from Physical Orders
        if (orderData.isSubscription) {
          const { data } = await axios.put('/api/users/profile/upgrade', { plan: orderData.plan }, config);
          updateUserData(data); // Immediately unlock Navbar/Dashboard UI
          navigate('/collector-dashboard', { replace: true });
        } else {
          // Construct final physical order payload
          const payload = {
            orderItems: orderData.orderItems,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: 'Razorpay (Mock)',
            itemsPrice: orderData.itemsPrice,
            taxPrice: orderData.taxPrice,
            shippingPrice: orderData.shippingPrice,
            totalPrice: orderData.totalPrice,
          };

          const { data } = await axios.post('/api/orders', payload, config);
          
          // Redirect to success Tracking
          navigate(`/order/${data._id}`, { replace: true, state: { newlyPlaced: true } });
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Payment simulation failed.');
        setProcessing(false);
      }
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '4rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      
      <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: '#020617', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Razorpay Secure Mock</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Test Mode</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Amount to Pay</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>₹{orderData.totalPrice.toFixed(2)}</h3>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#10b981', fontSize: '0.9rem', background: '#ecfdf5', padding: '0.8rem', borderRadius: '8px' }}>
            <ShieldCheck size={18} /> Payments are 100% secure and encrypted.
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Banking Institution (Mock)</label>
              <select 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
              >
                <option value="" disabled>Select Bank...</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="test">Razorpay Test Bank</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Card Number</label>
              <input 
                type="text" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required 
                maxLength="16"
                placeholder="4111 1111 1111 1111" 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Expiry (MM/YY)</label>
                <input 
                  type="text" 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required 
                  maxLength="5"
                  placeholder="12/26" 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>CVV</label>
                <input 
                  type="password" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required 
                  maxLength="3"
                  placeholder="123" 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={processing}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: processing ? '#94a3b8' : '#3266cf', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                cursor: processing ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {processing ? 'Processing Securely...' : <><CreditCard size={20} /> Pay ₹{orderData.totalPrice.toFixed(2)}</>}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>This is a simulated demo. No real money will be charged.</p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default MockRazorpay;
