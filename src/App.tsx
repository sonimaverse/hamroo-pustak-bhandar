import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import PortalSelect from './components/PortalSelect';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import FeaturedBooks from './components/FeaturedBooks';
import StationerySection from './components/StationerySection';
import Footer from './components/Footer';
import BulkOrderForm from './components/BulkOrderForm';
import CartPanel from './components/CartPanel';

type View = 'select' | 'customer' | 'admin-login' | 'admin-dashboard';

function App() {
  const [view, setView] = useState<View>('select');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (view === 'select') {
    return (
      <PortalSelect
        onSelectCustomer={() => setView('customer')}
        onSelectAdmin={() => setView('admin-login')}
      />
    );
  }

  if (view === 'admin-login') {
    return (
      <AdminLogin
        onBack={() => setView('select')}
        onLoginSuccess={() => setView('admin-dashboard')}
      />
    );
  }

  if (view === 'admin-dashboard') {
    return <AdminDashboard onLogout={() => setView('select')} />;
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#1a1209]">
        <Header
          onSwitchToAdmin={() => setView('admin-login')}
          onOpenEnquiry={() => setIsEnquiryOpen(true)}
          onToggleCart={() => setIsCartOpen((v) => !v)}
        />
        <Hero onOpenEnquiry={() => setIsEnquiryOpen(true)} />
        <TrustBar />
        <FeaturedBooks onOpenEnquiry={() => setIsEnquiryOpen(true)} />
        <StationerySection onOpenEnquiry={() => setIsEnquiryOpen(true)} />
        <Footer />
        <CartPanel
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onOpenEnquiry={() => setIsEnquiryOpen(true)}
        />
        <BulkOrderForm isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default App;