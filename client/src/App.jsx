import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import ArtworkDetails from './pages/ArtworkDetails';
import Pricing from './pages/Pricing';
import ArtistDashboard from './pages/artist/ArtistDashboard';
import UploadArtwork from './pages/artist/UploadArtwork';
import CollectorDashboard from './pages/CollectorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Checkout from './pages/Checkout';
import MockRazorpay from './pages/MockRazorpay';
import OrderDetails from './pages/OrderDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/artwork/:id" element={<ArtworkDetails />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes: Collector & Artist */}
              <Route element={<ProtectedRoute allowedRoles={['collector', 'artist', 'admin']} />}>
                <Route path="/collector-dashboard" element={<CollectorDashboard />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/payment-gateway" element={<MockRazorpay />} />
                <Route path="/order/:id" element={<OrderDetails />} />
              </Route>

              {/* Protected Routes: Artists and Admins only */}
              <Route element={<ProtectedRoute allowedRoles={['artist', 'admin']} />}>
                <Route path="/artist-dashboard" element={<ArtistDashboard />} />
                <Route path="/artist/upload" element={<UploadArtwork />} />
              </Route>

              {/* Protected Routes: Admins only */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
