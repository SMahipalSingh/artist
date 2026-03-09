import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DownloadCloud, Bookmark, Clock, Truck, Eye } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CollectorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <img src={user?.profileImage} alt={user?.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Collector Dashboard</h1>
          <p className="text-muted" style={{ margin: 0 }}>Welcome back, {user?.name}. Your subscription: <span style={{ color: '#c084fc', fontWeight: 'bold', textTransform: 'capitalize' }}>{user?.subscriptionPlan}</span></p>
        </div>
      </div>

      <div className="grid-auto" style={{ marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '12px' }}>
            <DownloadCloud size={24} color="#3b82f6" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Master PDF Downloads</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{user?.subscriptionPlan === 'basic' ? '0' : 'Unlimited'}</h3>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '1rem', borderRadius: '12px' }}>
            <Bookmark size={24} color="#ec4899" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Physical Prints Ordered</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{orders.length}</h3>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Truck size={24} /> Physical Order History
      </h2>
      
      {loading ? (
        <div style={{ color: '#94a3b8' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Clock size={40} color="#64748b" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p className="text-muted">Explore the gallery to find your first physical masterpiece.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>ORDER ID</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>DATE</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>TOTAL</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>PAYMENT</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>DELIVERY</th>
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'transparent', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#c084fc' }}>{order._id.substring(0, 8)}...</td>
                  <td style={{ padding: '1rem', color: '#e2e8f0' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: '#10b981', fontWeight: 'bold' }}>₹{order.totalPrice.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    {order.isPaid ? (
                      <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>Paid</span>
                    ) : (
                      <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>Failed</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {order.isDelivered ? (
                      <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>Delivered</span>
                    ) : (
                      <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>In Transit</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Link to={`/order/${order._id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Eye size={14} /> Track
                    </Link>
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

export default CollectorDashboard;
