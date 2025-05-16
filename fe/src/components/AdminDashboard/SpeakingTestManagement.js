import React, { useState, useEffect } from 'react';
import { 
  Table, Space, Avatar, Tag, Progress, Button, 
  Popconfirm, Input, Row, Col, Typography, Card, 
  Statistic, Divider, List 
} from 'antd';
import { 
  SoundOutlined, UserOutlined, EditOutlined, 
  DeleteOutlined, SearchOutlined, InfoCircleOutlined 
} from '@ant-design/icons';
import { TestDetailsModal } from './TestDetailModal';

const { Text, Title } = Typography;

const SpeakingTestManagement = ({ testResults, users }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  useEffect(() => {
    const filtered = testResults?.filter(test =>
      test.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      test.feedback.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchText, testResults]);

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <Space>
          <Avatar src={users.find(u => u.id === record.userId)?.avatar} icon={<UserOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: (a, b) => a.userName.localeCompare(b.userName)
    },
    {
      title: 'Test Date',
      dataIndex: 'testDate',
      key: 'testDate',
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.testDate) - new Date(b.testDate)
    },
    {
      title: 'Overall Score',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (text) => <Progress percent={text} size="small" />,
      sorter: (a, b) => a.overallScore - b.overallScore
    },
    {
      title: 'Pronunciation',
      dataIndex: 'pronunciation',
      key: 'pronunciation',
      render: (text) => <Tag color={text > 70 ? 'green' : text > 50 ? 'orange' : 'red'}>{text}</Tag>,
      sorter: (a, b) => a.pronunciation - b.pronunciation
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<InfoCircleOutlined />}
          onClick={() => {
            setCurrentTest(record);
            setIsDetailsVisible(true);
          }}
        >
          View Details
        </Button>
      )
    }
  ];

  const handleDelete = (id) => {
    // In a real app, you would call an API here
    console.log('Delete test result:', id);
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>Speaking Test Results</Title>
          </Col>
        </Row>
        
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Input
              placeholder="Search test results..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        
        <Table 
          columns={columns} 
          dataSource={filteredResults} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <TestDetailsModal
        visible={isDetailsVisible}
        onCancel={() => setIsDetailsVisible(false)}
        test={currentTest}
      />
    </div>
  );
};

export default SpeakingTestManagement;