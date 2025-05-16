import React from 'react';

// 简单的仪表盘统计卡片组件
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <span>{icon}</span>
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
      <style jsx>{`
        .stat-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          display: flex;
          align-items: center;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: 1.5rem;
        }
        .stat-content {
          flex: 1;
        }
        .stat-title {
          color: #666;
          font-size: 1rem;
          margin: 0 0 0.25rem 0;
          font-weight: 500;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

// 欢迎卡片组件
const WelcomeCard = ({ user }) => {
  return (
    <div className="welcome-card">
      <h2>欢迎回来，管理员!</h2>
      <p>这是您的博客管理控制台。您可以在这里管理博客文章、动态内容和朋友圈。</p>
      
      <div className="user-info">
        <div className="user-details">
          <p><strong>邮箱:</strong> {user?.email}</p>
          <p><strong>上次登录:</strong> {new Date().toLocaleString('zh-CN')}</p>
        </div>
      </div>
      
      <style jsx>{`
        .welcome-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .welcome-card h2 {
          margin-top: 0;
          color: #333;
        }
        .user-info {
          display: flex;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }
        .user-details {
          flex: 1;
        }
        .user-details p {
          margin: 0.5rem 0;
          color: #555;
        }
      `}</style>
    </div>
  );
};

// 快速操作卡片组件
const QuickActionsCard = ({ onNavigate }) => {
  const actions = [
    { id: 'create-post', label: '写新文章', icon: '📝', color: '#4CAF50', tab: 'posts' },
    { id: 'create-talking', label: '发布动态', icon: '💬', color: '#2196F3', tab: 'talking' },
    { id: 'manage-friends', label: '管理朋友圈', icon: '👥', color: '#FF9800', tab: 'friends' },
    { id: 'settings', label: '网站设置', icon: '⚙️', color: '#607D8B', tab: 'settings' },
  ];
  
  return (
    <div className="quick-actions-card">
      <h3>快速操作</h3>
      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className="action-button"
            style={{ backgroundColor: action.color }}
            onClick={() => onNavigate(action.tab)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .quick-actions-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }
        .quick-actions-card h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #333;
        }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .action-button {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .action-icon {
          font-size: 1.5rem;
          margin-right: 0.75rem;
        }
        .action-label {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

// 管理控制台组件
const DashboardManager = ({ onNavigate, stats }) => {
  // 默认统计数据（实际应用中应从API获取）
  const defaultStats = {
    postsCount: stats?.postsCount || 0,
    talkingsCount: stats?.talkingsCount || 0,
    friendsCount: stats?.friendsCount || 0,
    viewsCount: stats?.viewsCount || 0,
  };
  
  return (
    <div className="dashboard-manager">
      <WelcomeCard user={stats?.user} />
      
      <div className="stats-grid">
        <StatCard
          title="博客文章"
          value={defaultStats.postsCount}
          icon="📝"
          color="#4CAF50"
        />
        <StatCard
          title="动态内容"
          value={defaultStats.talkingsCount}
          icon="💬"
          color="#2196F3"
        />
        <StatCard
          title="朋友圈内容"
          value={defaultStats.friendsCount}
          icon="👥"
          color="#FF9800"
        />
        <StatCard
          title="总访问量"
          value={defaultStats.viewsCount}
          icon="👁️"
          color="#9C27B0"
        />
      </div>
      
      <div className="dashboard-row">
        <QuickActionsCard onNavigate={onNavigate} />
      </div>
      
      <style jsx>{`
        .dashboard-manager {
          padding: 1rem 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardManager; 