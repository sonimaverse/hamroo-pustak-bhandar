import { useState } from 'react';
import PortalSelect from './components/PortalSelect';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import FeaturedBooks from './components/FeaturedBooks';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';

type View = 'select' | 'customer' | 'admin-login' | 'admin-dashboard';

function App() {
  const [view, setView] = useState<View>('select');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

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
    <div className="min-h-screen bg-cream-50">
      <Header onSwitchToAdmin={() => setView('admin-login')} onOpenEnquiry={() => setIsEnquiryOpen(true)} />
      <Hero onOpenEnquiry={() => setIsEnquiryOpen(true)} />
      <TrustBar />
      <FeaturedBooks onOpenEnquiry={() => setIsEnquiryOpen(true)} />
      <Footer />
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  );
}

export default App;
