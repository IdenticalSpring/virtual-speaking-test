// src/components/AdminDashboard/AdminLayout.js
import React, { useState } from 'react';
import './styles.css';

// Ant Design components
import { Layout, Menu, Avatar, Badge, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  MessageOutlined,
  SoundOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SettingOutlined
} from '@ant-design/icons';

// Dashboard modules
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import SpeakingTestManagement from './SpeakingTestManagement';
import LessonManagement from './LessonManagement';
import FeedBackManagement from './FeedBackManagement';

// Modals (if needed elsewhere in the app)

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
    </Menu>
  );

  const renderSection = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'speaking-tests':
        return <SpeakingTestManagement />;
      case 'lessons':
        return <LessonManagement />;
      case 'feedback':
        return <FeedBackManagement />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeMenu]}
          onSelect={({ key }) => setActiveMenu(key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>User Management</Menu.Item>
          <Menu.Item key="speaking-tests" icon={<SoundOutlined />}>Speaking Tests</Menu.Item>
          <Menu.Item key="lessons" icon={<BookOutlined />}>Lesson Management</Menu.Item>
          <Menu.Item key="feedback" icon={<MessageOutlined />}>Feedback</Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header style={{ background: '#fff', padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
            <div />
            <Space size="large">
              <Badge count={5} size="small">
                <NotificationOutlined style={{ fontSize: 18 }} />
              </Badge>
              <Badge dot>
                <SettingOutlined style={{ fontSize: 18 }} />
              </Badge>
              <Dropdown overlay={userMenu} placement="bottomRight">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>Admin</span>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content style={{ margin: 16 }}>
          {renderSection()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
