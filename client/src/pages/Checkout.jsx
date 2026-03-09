import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Truck, CreditCard } from 'lucide-react';

const Checkout = () => {
  const { id } = useParams(); // Artwork ID
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Shipping State
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Fixed shipping price so it isn't "jumpy" when typing addresses
  const [shippingPrice, setShippingPrice] = useState(150.00);

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

  const handlePayment = (e) => {
    e.preventDefault();

    const orderData = {
      orderItems: [
        {
          name: artwork.title,
          qty: 1,
          image: artwork.imageUrl,
          price: artwork.price,
          artwork: artwork._id,
        }
      ],
      // Fulfilling backend schema with defaults since we simplified UI
      shippingAddress: { 
        address: address, 
        city: phone, // Repurposing schema city for phone string to keep Mongoose schema compatible without a backend rewrite
        postalCode: postalCode, 
        country: 'India' 
      },
      itemsPrice: artwork.price,
      taxPrice: 0,
      shippingPrice: shippingPrice,
      totalPrice: artwork.price + shippingPrice,
      token: user.token
    };

    // Redirect to explicitly mocked Razorpay page instead of processing here
    navigate('/payment-gateway', { state: orderData });
  };

  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>Loading secure checkout...</div>;
  if (!artwork) return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#ef4444' }}>Artwork not found.</div>;

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Secure Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.5fr) 1fr', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left: Shipping Form */}
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Truck size={28} color="#c084fc" />
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Shipping Details</h2>
          </div>

          <form id="checkout-form" onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Full Address</label>
              <textarea className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Street, City, State, Country" rows="3" style={{ resize: 'vertical' }}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Phone Number</label>
              <input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="e.g. +91 9876543210" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Pin Code</label>
              <input type="text" className="input-field" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="e.g. 400001" />
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="glass-panel" style={{ padding: '3rem 2rem', position: 'sticky', top: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', marginBottom: '2rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={artwork.imageUrl} alt={artwork.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{artwork.title}</h4>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Physical Print Form</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span>Items</span>
              <span>₹{artwork.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span>Shipping</span>
              <span>₹{shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
              <span>Total</span>
              <span style={{ color: '#c084fc' }}>₹{(artwork.price + shippingPrice).toFixed(2)}</span>
            </div>
          </div>

          <button form="checkout-form" type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            Proceed to Payment <CreditCard size={18} style={{marginLeft: '0.5rem', display: 'inline'}} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
