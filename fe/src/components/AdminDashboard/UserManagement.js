import React, { useState, useEffect } from 'react';
import {
  Table, Space, Avatar, Tag, Progress, Button, Popconfirm,
  Input, Row, Col, Typography, Card, Divider
} from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { UserModal } from './UserModals';

const { Text } = Typography;

const UserManagement = ({ users, setUsers }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalType, setModalType] = useState('add');

  useEffect(() => {
    const filtered = users?.filter(user =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ display: 'block' }}>{record.email}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'active' ? 'green' : 'red'}>{text}</Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (
        <Tag color={text === 'admin' ? 'gold' : 'blue'}>{text}</Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Student', value: 'student' }
      ],
      onFilter: (value, record) => record.role === value
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (text) => <Progress percent={text} size="small" />,
      sorter: (a, b) => a.progress - b.progress
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => {
              setCurrentUser(record);
              setModalType('edit');
              setIsModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setModalType('add');
    setIsModalVisible(true);
  };

  const handleSaveUser = (user) => {
    if (modalType === 'add') {
      setUsers([...users, {
        ...user,
        id: Date.now().toString(),
        avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
        lastLogin: new Date().toISOString(),
        joinDate: new Date().toISOString().split('T')[0],
        progress: 0
      }]);
    } else {
      setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...user } : u));
    }
    setIsModalVisible(false);
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Typography.Title level={4}>User Management</Typography.Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </Col>
        </Row>
        
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <UserModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveUser}
        user={currentUser}
        type={modalType}
      />
    </div>
  );
};

export default UserManagement;