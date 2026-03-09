import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import ArtworkCard from '../../components/ArtworkCard';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Fetch artworks and theoretically fetch all orders to filter by this artist
        const [artRes, salesRes] = await Promise.all([
           axios.get('/api/artworks'),
           axios.get('/api/orders/my-sales', config)
        ]);
        
        const myArt = artRes.data.filter(art => art.artist && art.artist._id === user._id);
        setArtworks(myArt);
        setOrders(salesRes.data);

      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/artworks/${id}`, config);
        setArtworks(artworks.filter(art => art._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting artwork');
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, config);
      // Update local state
      setOrders(orders.map(o => o._id === orderId ? data : o));
    } catch (err) {
      alert('Error updating status');
    }
  };

  // Calculate 90% artist proceeds from their valid sales
  const totalEarnings = orders.reduce((acc, order) => acc + (order.isPaid && order.artistPayout ? order.artistPayout : 0), 0);

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <img src={user?.profileImage || '/uploads/default-avatar.png'} alt={user?.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Artist Dashboard</h1>
          <p className="text-muted" style={{ margin: 0 }}>Manage your portfolio and track your sales, {user?.name}.</p>
        </div>
      </div>

      <div className="grid-auto" style={{ marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '1rem', borderRadius: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎨</span>
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Total Artworks</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{artworks.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>💵</span>
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Total Earnings</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>₹{totalEarnings.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>My Portfolio</h2>
        <Link to="/artist/upload" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>+ Upload New Art</Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading your artworks...</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : artworks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', marginBottom: '4rem' }}>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>You haven't uploaded any artworks yet.</p>
          <Link to="/artist/upload" className="btn btn-outline" style={{ color: '#c084fc', borderColor: '#c084fc' }}>Start Uploading</Link>
        </div>
      ) : (
        <div className="grid-auto" style={{ marginBottom: '4rem' }}>
          {artworks.map((art) => (
            <div key={art._id} style={{ position: 'relative' }}>
              <ArtworkCard 
                artwork={art}
              />
              <button 
                onClick={() => handleDelete(art._id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Orders Management Table */}
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Active Orders</h2>
      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-muted">No sales orders yet.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1.5rem', color: '#94a3b8', fontWeight: 'normal' }}>Order ID</th>
                <th style={{ padding: '1.5rem', color: '#94a3b8', fontWeight: 'normal' }}>Item</th>
                <th style={{ padding: '1.5rem', color: '#94a3b8', fontWeight: 'normal' }}>My Cut (90%)</th>
                <th style={{ padding: '1.5rem', color: '#94a3b8', fontWeight: 'normal' }}>Shipping Details</th>
                <th style={{ padding: '1.5rem', color: '#94a3b8', fontWeight: 'normal' }}>Status</th>
                <th style={{ padding: '1.5rem', color: '#94a3b8', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1.5rem', fontFamily: 'monospace', color: '#c084fc' }}>{order._id.substring(0, 8)}...</td>
                  <td style={{ padding: '1.5rem' }}>{order.orderItems[0]?.name || 'Artwork'}</td>
                  <td style={{ padding: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>₹{order.artistPayout?.toFixed(2)}</td>
                  <td style={{ padding: '1.5rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    {order.shippingAddress?.address}<br/>
                    PIN: {order.shippingAddress?.postalCode}<br/>
                    <span style={{ color: '#c084fc' }}>📞 {order.shippingAddress?.city}</span> 
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      background: order.orderStatus === 'Delivered' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: order.orderStatus === 'Delivered' ? '#10b981' : '#3b82f6',
                    }}>
                      {order.orderStatus || 'Ordered'}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    {(order.orderStatus === 'Ordered' || !order.orderStatus) && (
                       <button onClick={() => handleStatusUpdate(order._id, 'Accepted')} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderColor: '#3b82f6', color: '#3b82f6' }}>Accept Order</button>
                    )}
                    {order.orderStatus === 'Accepted' && (
                       <button onClick={() => handleStatusUpdate(order._id, 'Shipped')} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Mark Shipped</button>
                    )}
                    {order.orderStatus === 'Shipped' && (
                       <span className="text-muted" style={{ fontSize: '0.8rem' }}>Waiting Delivery</span>
                    )}
                    {order.orderStatus === 'Delivered' && (
                       <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
