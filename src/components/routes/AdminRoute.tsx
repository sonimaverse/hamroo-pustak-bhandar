import React from 'react';
import { Navigate, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export const AdminRoute: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Checking administrative privileges..." />
      </div>
    );
  }

  // Not logged in → normal login page
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Logged in but not admin
  if (user?.role !== 'admin') {
    const handleSwitchToAdmin = () => {
      logout();

      navigate('/login', {
        state: {
          from: location,
          adminLogin: true,
        },
      });
    };

    return (
      <div className="max-w-md mx-auto my-16 bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-serif font-bold text-stone-900">
          Administrator Access Required
        </h2>

        <p className="text-xs text-stone-600 leading-relaxed">
          You are currently signed in as{' '}
          <strong className="text-stone-900">
            {user?.name} ({user?.email})
          </strong>
          , which has{' '}
          <span className="uppercase font-bold text-amber-700">
            {user?.role}
          </span>{' '}
          privileges.
        </p>

        <p className="text-xs text-stone-500">
          To open the Store Administration Portal, please sign in using
          administrator credentials.
        </p>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={handleSwitchToAdmin}
            className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In as Store Administrator</span>
          </button>

          <Link
            to="/"
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated admin → allow /admin
  return <Outlet />;
};