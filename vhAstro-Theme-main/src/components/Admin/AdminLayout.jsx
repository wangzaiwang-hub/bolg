import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// 简单的认证管理
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储检查是否已登录
    const checkAuth = async () => {
      const session = await supabase.auth.getSession();
      setUser(session?.data?.session?.user || null);
      setLoading(false);
    };

    checkAuth();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 登录方法
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 使用Supabase内置的认证系统
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { user, loading, login, logout };
};

// 登录表单组件
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setError(result.error || '登录失败，请检查邮箱和密码');
      }
    } catch (err) {
      setError('登录过程中发生错误');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>管理员登录</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">邮箱:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
        }
        .login-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--vh-main-color, #01C4B6);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: var(--vh-main-color-dark, #00a19a);
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .error-message {
          color: #e53935;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background-color: rgba(229, 57, 53, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

// 侧边栏组件
const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const tabs = [
    { id: 'dashboard', label: '控制台', icon: '📊' },
    { id: 'posts', label: '博客文章', icon: '📝' },
    { id: 'talking', label: '动态内容', icon: '💬' },
    { id: 'friends', label: '朋友圈', icon: '👥' },
    { id: 'settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>博客管理</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          退出登录
        </button>
      </div>
      <style>{`
        .admin-sidebar {
          background-color: #2c3e50;
          color: white;
          width: 250px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
        }
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sidebar-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }
        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .sidebar-nav li {
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.3s;
        }
        .sidebar-nav li:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .sidebar-nav li.active {
          background-color: var(--vh-main-color, #01C4B6);
        }
        .tab-icon {
          margin-right: 0.75rem;
          font-size: 1.25rem;
        }
        .sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logout-button {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .logout-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

// 主布局组件
const AdminLayout = ({ children }) => {
  const { user, loading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 如果正在加载，显示加载中
  if (loading) {
    return <div className="loading">加载中...</div>;
  }
  
  // 如果未登录，显示登录表单
  if (!user) {
    return <LoginForm onLogin={login} />;
  }
  
  // 如果已登录，显示管理界面
  return (
    <div className="admin-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
      />
      <div className="admin-content">
        {children({ activeTab, user, setActiveTab })}
      </div>
      <style>{`
        .admin-layout {
          display: flex;
        }
        .admin-content {
          flex: 1;
          margin-left: 250px;
          padding: 2rem;
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout; 