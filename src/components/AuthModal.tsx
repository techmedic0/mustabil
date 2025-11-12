import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useUser();
  const { login: adminLogin } = useAuth();
  const navigate = useNavigate();

  const isAdminEmail = email === 'bilqismustapha2@gmail.com';

  useEffect(() => {
    if (isOpen) {
      setError('');
      setEmail('');
      setPassword('');
      setFullName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isAdminEmail) {
        const success = await adminLogin(email, password);
        if (success) {
          onClose();
          navigate('/admin/dashboard');
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        if (mode === 'signup') {
          const result = await signUp(email, password, fullName);
          if (result.success) {
            onClose();
            if (onSuccess) onSuccess();
          } else {
            setError(result.error || 'Signup failed');
          }
        } else {
          const result = await signIn(email, password);
          if (result.success) {
            onClose();
            if (onSuccess) onSuccess();
          } else {
            setError(result.error || 'Login failed');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-emerald-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-cyan-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-emerald-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
      </div>
      <div className="relative w-full max-w-md transform transition-all">
        <button
  onClick={onClose}
  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-lg hover:scale-110 border border-white/20"
>
  <X className="w-5 h-5 text-white" />
</button>


        <div className="bg-gradient-to-br from-white via-emerald-50/30 to-cyan-50/30 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          {/* Keep decorative overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

          {/* SCROLLABLE PANEL: constrained height + custom scrollbar class */}
          <div
            className="relative p-8 sm:p-10 max-h-[90vh] overflow-y-auto scroll-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* (rest of your content remains unchanged) */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 rounded-3xl mb-6 shadow-2xl transform hover:rotate-6 transition-transform duration-700 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                {isAdminEmail ? (
                  <Crown className="w-12 h-12 text-white relative z-10 animate-bounce-slow" />
                ) : (
                  <Sparkles className="w-12 h-12 text-white relative z-10" />
                )}
              </div>

              <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-3 animate-gradient">
                {isAdminEmail
                  ? 'Welcome, Your Majesty'
                  : mode === 'signin'
                  ? 'Welcome Back'
                  : 'Join Mustabil'}
              </h2>
              <p className="text-gray-700 font-medium text-lg">
                {isAdminEmail
                  ? 'Access your admin kingdom'
                  : mode === 'signin'
                  ? 'Sign in to continue shopping'
                  : 'Create an account to get started'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && !isAdminEmail && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full pl-14 pr-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-14 pr-14 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                />
                {isAdminEmail && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-pulse">
                    <Crown className="w-6 h-6 text-yellow-500 drop-shadow-lg" />
                  </div>
                )}
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-14 pr-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-semibold animate-shake shadow-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isAdminEmail ? (
                        <>
                          <Crown className="w-6 h-6" />
                          Enter Kingdom
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          {mode === 'signin' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </>
                  )}
                </span>
              </button>
            </form>

            {!isAdminEmail && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors text-lg group"
                >
                  {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  <span className="underline decoration-2 underline-offset-4 group-hover:underline-offset-8 transition-all">
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </span>
                </button>
              </div>
            )}

            {isAdminEmail && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl text-center shadow-lg">
                <p className="text-sm text-yellow-800 font-bold flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 animate-pulse" />
                  Admin Access Detected
                  <Crown className="w-5 h-5 animate-pulse" />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
