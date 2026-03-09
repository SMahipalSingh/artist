import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, Activity, Settings, UserX } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch users and orders in parallel
        const [usersRes, ordersRes] = await Promise.all([
          axios.get('/api/users', config),
          axios.get('/api/orders', config)
        ]);
        
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/users/${id}`, config);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  // Calculate Total Commission Revenue (10% of physical orders)
  const commissionRevenue = orders.reduce((acc, order) => acc + (order.isPaid && order.platformFee ? order.platformFee : 0), 0);
  
  // Calculate Subscription Revenue (based on user plans active)
  const subscriptionRevenue = users.reduce((acc, user) => {
    if (user.subscriptionPlan === 'pro') return acc + 1499;
    if (user.subscriptionPlan === 'studio') return acc + 6999;
    return acc;
  }, 0);

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Settings size={32} color="#ef4444" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>System Admin</h1>
          <p className="text-muted" style={{ margin: 0 }}>Manage users and view platform generated revenue.</p>
        </div>
      </div>

      <div className="grid-auto" style={{ marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '12px' }}>
            <Users size={24} color="#3b82f6" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Total Users</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{users.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px' }}>
            <Activity size={24} color="#10b981" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Subscription Earnings</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>₹{subscriptionRevenue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '12px' }}>
            <Activity size={24} color="#f59e0b" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Commission Earnings</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#f59e0b' }}>₹{commissionRevenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>User Directory</h2>
      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1.5rem 2rem', color: '#94a3b8', fontWeight: 'normal' }}>Name</th>
                <th style={{ padding: '1.5rem 2rem', color: '#94a3b8', fontWeight: 'normal' }}>Email</th>
                <th style={{ padding: '1.5rem 2rem', color: '#94a3b8', fontWeight: 'normal' }}>Role</th>
                <th style={{ padding: '1.5rem 2rem', color: '#94a3b8', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1.5rem 2rem' }}>{u.name} {u.role === 'admin' && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginLeft: '0.5rem' }}>(Admin)</span>}</td>
                  <td style={{ padding: '1.5rem 2rem', color: '#cbd5e1' }}>{u.email}</td>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      background: u.role === 'artist' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: u.role === 'artist' ? '#10b981' : '#3b82f6',
                      textTransform: 'capitalize'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleDelete(u._id)}
                        className="btn" 
                        style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                      >
                        <UserX size={16} /> Ban User
                      </button>
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

export default AdminDashboard;
