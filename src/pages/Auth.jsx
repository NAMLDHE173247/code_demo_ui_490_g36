import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

// SVG Icons
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const OutlookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 4.5l10.5-2v19l-10.5-2v-15z" fill="#0078D4"/>
    <path d="M11.5 2.5v19H23V2.5H11.5z" fill="#28A8EA"/>
    <path d="M6 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm0 5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" fill="#FFF"/>
  </svg>
);

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate login user data with 3 roles: admin, superviver, staff
    let role = 'staff';
    let name = 'Staff User';

    if (password === '1') {
      if (email === 'admin' || email === 'admin@example.com') {
        role = 'admin';
        name = 'Admin User';
      } else if (email === 'superviver' || email === 'superviver@example.com') {
        role = 'superviver';
        name = 'Supervisor User';
      } else if (email === 'staff' || email === 'staff@example.com') {
        role = 'staff';
        name = 'Staff User';
      } else {
        alert('Tài khoản test không hợp lệ. Vui lòng dùng: admin, superviver, hoặc staff với mật khẩu 1.');
        return;
      }
    } else {
      alert('Sai mật khẩu! Vui lòng nhập mật khẩu 1 để test.');
      return;
    }

    login({ name: name, role: role, email: email });
    navigate('/dashboard');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    navigate(isLogin ? '/register' : '/login', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ transition: 'all 0.4s ease' }}>
        <div className="auth-header">
          <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Log in to your Learning Hub account' : 'Join Learning Hub today'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          
          {/* Dynamic field for Registration only */}
          <div style={{
            maxHeight: isLogin ? '0' : '100px',
            opacity: isLogin ? '0' : '1',
            overflow: 'hidden',
            transition: 'all 0.4s ease'
          }}>
            <div className="input-group" style={{ paddingBottom: '20px' }}>
              <label className="input-label">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                required={!isLogin} 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address / Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="admin / superviver / staff" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <label className="input-label">Password</label>
              {isLogin && (
                <a href="#" className="auth-link" style={{fontSize: '13px', fontWeight: '500'}}>Forgot Password?</a>
              )}
            </div>
            <input 
              type="password" 
              className="input-field" 
              placeholder="•••••••• (Test pass: 1)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="auth-btn" style={{marginTop: '16px'}}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">or {isLogin ? 'log in' : 'register'} with</div>

        <div className="social-login">
          <button className="social-btn" onClick={handleSubmit} type="button">
            <GoogleIcon />
            Google
          </button>
          <button className="social-btn" onClick={handleSubmit} type="button">
            <OutlookIcon />
            Outlook
          </button>
        </div>

        <div className="auth-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={toggleMode} 
            className="auth-link" 
            style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit'}}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
