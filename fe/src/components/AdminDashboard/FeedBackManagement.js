import React, { useState, useEffect } from 'react';
import { 
  Table, Space, Avatar, Tag, Button, Popconfirm, 
  Input, Row, Col, Typography, Card, Modal, Form, 
  Select, Divider 
} from 'antd';
import { 
  MessageOutlined, UserOutlined, EditOutlined, 
  DeleteOutlined, SearchOutlined, CheckCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;

const FeedbackManagement = ({ feedbacks, users, setFeedbacks }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const filtered = feedbacks?.filter(feedback =>
      feedback.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
  }, [searchText, feedbacks]);

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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <Tag color={text === 'bug' ? 'red' : text === 'feature_request' ? 'blue' : 'green'}>
          {text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Tag>
      ),
      filters: [
        { text: 'Bug', value: 'bug' },
        { text: 'Feature Request', value: 'feature_request' },
        { text: 'General Feedback', value: 'general_feedback' }
      ],
      onFilter: (value, record) => record.type === value
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'open' ? 'orange' : 'green'}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </Tag>
      ),
      filters: [
        { text: 'Open', value: 'open' },
        { text: 'Closed', value: 'closed' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (text) => (
        <Tag color={text === 'high' ? 'red' : text === 'medium' ? 'orange' : 'green'}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </Tag>
      ),
      filters: [
        { text: 'High', value: 'high' },
        { text: 'Medium', value: 'medium' },
        { text: 'Low', value: 'low' }
      ],
      onFilter: (value, record) => record.priority === value
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date)
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
              setCurrentFeedback(record);
              setIsModalVisible(true);
              form.setFieldsValue({
                status: record.status,
                priority: record.priority
              });
            }}
          />
          <Popconfirm
            title="Are you sure to delete this feedback?"
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
    setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const updatedFeedbacks = feedbacks.map(feedback => 
        feedback.id === currentFeedback.id ? { ...feedback, ...values } : feedback
      );
      setFeedbacks(updatedFeedbacks);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>Feedback Management</Title>
          </Col>
        </Row>
        
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Input
              placeholder="Search feedback..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        
        <Table 
          columns={columns} 
          dataSource={filteredFeedbacks} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title="Edit Feedback"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select>
              <Option value="open">Open</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select a priority!' }]}
          >
            <Select>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          <Divider />
          <Text strong>Original Feedback:</Text>
          <Card style={{ marginTop: 8 }}>
            <Text>{currentFeedback?.message}</Text>
          </Card>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;