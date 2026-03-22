import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [id, user]);

  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>Loading secure tracking tracking...</div>;
  if (error) return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;
  if (!order) return null;

  // Determine State Pipeline: Ordered -> Accepted -> Shipped -> In Transit -> Delivered
  const status = order.orderStatus || 'Ordered';
  
  // Create simple boolean flags for the UI steps
  const isOrdered = true;
  const isAccepted = ['Accepted', 'Shipped', 'In Transit', 'Delivered'].includes(status);
  const isShipped = ['Shipped', 'In Transit', 'Delivered'].includes(status);
  const isInTransit = ['In Transit', 'Delivered'].includes(status);
  const isDelivered = status === 'Delivered';

  // Determine line width
  let fillWidth = '0%';
  if (isDelivered) fillWidth = '100%';
  else if (isInTransit) fillWidth = '75%';
  else if (isShipped) fillWidth = '50%';
  else if (isAccepted) fillWidth = '25%';

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Order Tracking</h1>
          <p className="text-muted" style={{ margin: 0 }}>Order ID: <span style={{ fontFamily: 'monospace', color: '#c084fc' }}>{order._id}</span></p>
        </div>
        <Link to="/collector-dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.5fr) 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Col: Tracking Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
            <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Package size={24} color="#7c3aed" /> Current Status
            </h3>

            {/* Visual Tracking Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', marginBottom: '3rem', padding: '0 1rem' }}>
              {/* Connecting Line */}
              <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '4px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}>
                {/* Active Fill */}
                <div style={{ 
                  height: '100%', 
                  background: '#10b981', 
                  width: fillWidth,
                  transition: 'width 0.5s ease'
                }} />
              </div>

              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isOrdered ? '#10b981' : '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   <Clock size={24} color={isOrdered ? "white" : "#94a3b8"} />
                </div>
                <span style={{ fontSize: '0.9rem', color: isOrdered ? '#f8fafc' : '#94a3b8', fontWeight: 'bold' }}>Ordered</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Processing'}</span>
              </div>

              {/* Step 2 (Accepted) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isAccepted ? '#10b981' : '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   <CheckCircle size={24} color={isAccepted ? "white" : "#94a3b8"} />
                </div>
                <span style={{ fontSize: '0.9rem', color: isAccepted ? '#f8fafc' : '#94a3b8', fontWeight: 'bold' }}>Accepted</span>
              </div>

              {/* Step 3 (Shipped) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isShipped ? '#10b981' : '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   <Package size={24} color={isShipped ? "white" : "#94a3b8"} />
                </div>
                <span style={{ fontSize: '0.9rem', color: isShipped ? '#f8fafc' : '#94a3b8', fontWeight: 'bold' }}>Shipped</span>
              </div>

              {/* Step 4 (In Transit) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isInTransit || isDelivered ? '#10b981' : '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center', border: isInTransit && !isDelivered ? '2px solid #34d399' : 'none' }}>
                   <Truck size={24} color={isInTransit || isDelivered ? "white" : "#94a3b8"} />
                </div>
                <span style={{ fontSize: '0.9rem', color: isInTransit || isDelivered ? '#f8fafc' : '#94a3b8', fontWeight: 'bold' }}>In Transit</span>
              </div>

              {/* Step 5 (Delivered) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isDelivered ? '#10b981' : '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   <CheckCircle size={24} color={isDelivered ? "white" : "#94a3b8"} />
                </div>
                <span style={{ fontSize: '0.9rem', color: isDelivered ? '#f8fafc' : '#94a3b8', fontWeight: 'bold' }}>Delivered</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{isDelivered ? 'Done' : 'Pending'}</span>
              </div>
            </div>

            {/* Address Summary */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#e2e8f0' }}>Delivery Information</h4>
              <p style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1' }}><strong>{order.user_id?.name || 'Customer'}</strong></p>
              <p style={{ margin: '0 0 0.2rem 0', color: '#94a3b8' }}>Delivery handled dynamically per area.</p>
              <p style={{ margin: 0, color: '#94a3b8' }}>Contact Support for exact shipping location details.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.5rem' }}>Receipt Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {order.orderItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem' }}>{item.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Qty: {item.qty}</p>
                </div>
                <div style={{ fontWeight: 'bold' }}>₹{item.price}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>₹{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dynamic Shipping</span>
              <span>₹{order.shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
              <span>Total Paid</span>
              <span style={{ color: '#10b981' }}>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.9rem' }}>
            Paid securely via {order.paymentMethod}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
