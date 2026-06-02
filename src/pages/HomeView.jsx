import React from 'react';
import { 
  MessageSquare, 
  Database, 
  Zap, 
  Package, 
  BarChart2, 
  ArrowRight,
  Activity,
  Clock,
  Users,
  UserPlus,
  UserCheck,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import '../home.css';

function HomeView({ setActiveTab }) {
  const stats = [
    { value: '12', label: 'Datasets', color: 'text-primary' },
    { value: '2', label: 'Active Jobs', color: 'text-blue' },
    { value: '18.4 GB', label: 'VRAM Used', color: 'text-green' },
    { value: '10', label: 'Total Users', color: 'text-orange' }
  ];

  // Account management stats
  const accountStats = {
    total: 10,
    active: 5,
    pending: 3,
    banned: 1,
    inactive: 1,
    newThisWeek: 4,
    growthPercent: 25
  };

  const recentAccounts = [
    { name: 'Bùi Văn H', email: 'buivanh@fpt.edu.vn', status: 'pending', role: 'Staff', avatar: 'BH', time: '2 hours ago' },
    { name: 'Võ Thanh E', email: 'vothanhe@fpt.edu.vn', status: 'pending', role: 'Staff', avatar: 'VE', time: '5 hours ago' },
    { name: 'Phạm Minh D', email: 'phamminhd@fpt.edu.vn', status: 'pending', role: 'Staff', avatar: 'PD', time: '1 day ago' },
    { name: 'Ngô Thị I', email: 'ngothii@fpt.edu.vn', status: 'active', role: 'Supervisor', avatar: 'NI', time: '3 days ago' },
  ];

  // Role distribution for visual bar — 3 roles
  const roleDistribution = [
    { role: 'Admin', count: 1, color: '#f59e0b', icon: <ShieldCheck size={14} style={{ color: '#f59e0b' }} /> },
    { role: 'Supervisor', count: 2, color: '#10b981', icon: <ShieldAlert size={14} style={{ color: '#10b981' }} /> },
    { role: 'Staff', count: 7, color: '#6366f1', icon: <Shield size={14} style={{ color: '#6366f1' }} /> },
  ];

  const cards = [
    {
      icon: <MessageSquare size={24} />,
      title: 'Chat',
      description: 'Conversational AI with streaming inference and model comparison',
      metaIcon: <Activity size={14} />,
      metaText: '3 active sessions',
      actionText: 'New Chat',
      badge: 'Idle',
      badgeColor: 'default',
      tab: 'Chat'
    },
    {
      icon: <Database size={24} />,
      title: 'Data Prep',
      description: 'Multi-step dataset conversion, clustering, labeling, and export pipeline',
      metaIcon: <Activity size={14} />,
      metaText: '12 datasets',
      actionText: 'Start Conversion',
      badge: 'Idle',
      badgeColor: 'default',
      tab: 'Data Prep'
    },
    {
      icon: <Zap size={24} />,
      title: 'AutoTrain',
      description: 'Configure and run training jobs with live GPU monitoring and SSE logs',
      metaIcon: <Activity size={14} />,
      metaText: '2 active jobs',
      actionText: 'New Training Job',
      badge: 'Running',
      badgeColor: 'success',
      tab: 'AutoTrain'
    },
    {
      icon: <Package size={24} />,
      title: 'Model Registry',
      description: 'Upload, version, and manage models with deployment capabilities',
      metaIcon: <Activity size={14} />,
      metaText: '8 models',
      actionText: 'Browse Models',
      badge: 'Idle',
      badgeColor: 'default',
      tab: 'Model Registry'
    },
    {
      icon: <BarChart2 size={24} />,
      title: 'Model Evaluation',
      description: 'Run standardized evaluations and compare model performance',
      metaIcon: <Activity size={14} />,
      metaText: '5 evaluations',
      actionText: 'Run Evaluation',
      badge: 'Idle',
      badgeColor: 'default',
      tab: 'Model Eval'
    },
    {
      icon: <Users size={24} />,
      title: 'Manager Account',
      description: 'Manage user accounts, approvals, roles and permissions',
      metaIcon: <AlertTriangle size={14} />,
      metaText: `${accountStats.pending} pending approvals`,
      actionText: 'Manage Accounts',
      badge: accountStats.pending > 0 ? `${accountStats.pending} Pending` : 'OK',
      badgeColor: accountStats.pending > 0 ? 'warning' : 'default',
      tab: 'Manager Account'
    }
  ];

  const activities = [
    {
      icon: <UserPlus size={18} className="activity-icon-user" />,
      title: 'New account registered',
      subtitle: 'Bùi Văn H — Staff',
      time: '2 hours ago'
    },
    {
      icon: <UserCheck size={18} className="activity-icon-approve" />,
      title: 'Account approved',
      subtitle: 'Ngô Thị I — Supervisor',
      time: '3 hours ago'
    },
    {
      icon: <Zap size={18} className="activity-icon-zap" />,
      title: 'Training job completed',
      subtitle: 'model-v2-llama-8b',
      time: '5 hours ago'
    },
    {
      icon: <Database size={18} className="activity-icon-db" />,
      title: 'Dataset uploaded',
      subtitle: 'conversation-data-v3.jsonl',
      time: '8 hours ago'
    },
    {
      icon: <Ban size={18} className="activity-icon-ban" />,
      title: 'Account banned',
      subtitle: 'Đỗ Quang F — Staff',
      time: '1 day ago'
    },
    {
      icon: <BarChart2 size={18} className="activity-icon-chart" />,
      title: 'Evaluation completed',
      subtitle: 'GPT-4 vs Claude comparison',
      time: '2 days ago'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle2 size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'banned': return <Ban size={12} />;
      default: return null;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin': return 'role-dot-admin';
      case 'Supervisor': return 'role-dot-supervisor';
      case 'Staff': return 'role-dot-staff';
      default: return '';
    }
  };

  return (
    <div className="home-view">
      {/* Header Section */}
      <div className="home-header card">
        <div className="home-header-title">
          <h1>Welcome to SEP490</h1>
          <p>Enterprise ML & Data Platform</p>
        </div>
        <div className="home-header-stats">
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="stat-item">
                <span className={`stat-value ${stat.color}`}>{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              {index < stats.length - 1 && <div className="stat-divider"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Account Management Overview Section */}
      <div className="account-overview-section">
        <div className="account-overview-header">
          <div className="account-overview-title">
            <Users size={20} />
            <h2>Account Overview</h2>
          </div>
          <button className="account-manage-btn" onClick={() => setActiveTab('Manager Account')}>
            <span>Manage All</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="account-stats-grid">
          <div className="account-stat-card account-stat-total" onClick={() => setActiveTab('Manager Account')}>
            <div className="account-stat-icon-wrapper">
              <Users size={22} />
            </div>
            <div className="account-stat-content">
              <span className="account-stat-number">{accountStats.total}</span>
              <span className="account-stat-text">Total Accounts</span>
            </div>
            <div className="account-stat-trend">
              <TrendingUp size={14} />
              <span>+{accountStats.growthPercent}%</span>
            </div>
          </div>

          <div className="account-stat-card account-stat-active" onClick={() => setActiveTab('Manager Account')}>
            <div className="account-stat-icon-wrapper">
              <CheckCircle2 size={22} />
            </div>
            <div className="account-stat-content">
              <span className="account-stat-number">{accountStats.active}</span>
              <span className="account-stat-text">Active</span>
            </div>
            <div className="account-stat-bar">
              <div className="account-stat-bar-fill" style={{ width: `${(accountStats.active / accountStats.total) * 100}%` }}></div>
            </div>
          </div>

          <div className="account-stat-card account-stat-pending" onClick={() => setActiveTab('Manager Account')}>
            <div className="account-stat-icon-wrapper">
              <Clock size={22} />
            </div>
            <div className="account-stat-content">
              <span className="account-stat-number">{accountStats.pending}</span>
              <span className="account-stat-text">Pending Approval</span>
            </div>
            {accountStats.pending > 0 && (
              <div className="account-stat-alert">
                <AlertTriangle size={14} />
                <span>Needs review</span>
              </div>
            )}
          </div>

          <div className="account-stat-card account-stat-banned" onClick={() => setActiveTab('Manager Account')}>
            <div className="account-stat-icon-wrapper">
              <Ban size={22} />
            </div>
            <div className="account-stat-content">
              <span className="account-stat-number">{accountStats.banned}</span>
              <span className="account-stat-text">Banned</span>
            </div>
          </div>
        </div>

        {/* Role Distribution + Recent Accounts */}
        <div className="account-detail-row">
          {/* Role Distribution */}
          <div className="account-detail-card card">
            <div className="account-detail-card-header">
              <h3><Shield size={16} /> Role Distribution</h3>
            </div>
            <div className="role-distribution-content">
              <div className="role-bar-chart">
                {roleDistribution.map((item, idx) => (
                  <div className="role-bar-row" key={idx}>
                    <div className="role-bar-label">
                      {item.icon}
                      <span>{item.role}</span>
                    </div>
                    <div className="role-bar-track">
                      <div
                        className="role-bar-fill"
                        style={{
                          width: `${(item.count / accountStats.total) * 100}%`,
                          background: item.color
                        }}
                      ></div>
                    </div>
                    <span className="role-bar-count">{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="role-summary">
                {roleDistribution.map((item, idx) => (
                  <div className="role-summary-item" key={idx}>
                    <span className="role-dot" style={{ background: item.color }}></span>
                    <span>{item.role}: {((item.count / accountStats.total) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Registrations */}
          <div className="account-detail-card card">
            <div className="account-detail-card-header">
              <h3><UserPlus size={16} /> Recent Registrations</h3>
              <span className="new-badge">+{accountStats.newThisWeek} this week</span>
            </div>
            <div className="recent-accounts-list">
              {recentAccounts.map((account, idx) => (
                <div className="recent-account-item" key={idx}>
                  <div className={`recent-account-avatar ${account.status === 'pending' ? 'avatar-pending' : ''}`}>
                    {account.avatar}
                  </div>
                  <div className="recent-account-info">
                    <span className="recent-account-name">{account.name}</span>
                    <span className="recent-account-email">{account.email}</span>
                  </div>
                  <div className={`recent-account-role ${getRoleBadgeClass(account.role)}`}>
                    <span>{account.role}</span>
                  </div>
                  <div className={`recent-account-status status-dot-${account.status}`}>
                    {getStatusIcon(account.status)}
                    <span>{account.status}</span>
                  </div>
                  <span className="recent-account-time">{account.time}</span>
                </div>
              ))}
            </div>
            <div className="account-detail-footer" onClick={() => setActiveTab('Manager Account')}>
              <span>View all accounts</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="home-cards-grid">
        {cards.map((card, index) => (
          <div className="home-card card" key={index}>
            <div className="home-card-header">
              <div className="home-card-icon">
                {card.icon}
              </div>
              <div className={`home-badge badge-${card.badgeColor}`}>
                {card.badgeColor === 'success' && <div className="badge-dot"></div>}
                {card.badgeColor === 'warning' && <div className="badge-dot-warning"></div>}
                {card.badge}
              </div>
            </div>
            <div className="home-card-body">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="home-card-meta">
                {card.metaIcon}
                <span>{card.metaText}</span>
              </div>
            </div>
            <div className="home-card-footer" onClick={() => setActiveTab(card.tab)}>
              <span>{card.actionText}</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="home-activity card">
        <div className="activity-header">
          <h2>Recent Activity</h2>
          <span className="view-all">View All</span>
        </div>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div className="activity-item" key={index}>
              <div className="activity-icon-wrapper">
                {activity.icon}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-subtitle">{activity.subtitle}</div>
              </div>
              <div className="activity-time">
                <Clock size={14} />
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeView;
