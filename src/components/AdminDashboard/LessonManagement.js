import React, { useState, useEffect } from 'react';
import { 
  Table, Space, Tag, Button, Popconfirm, Input, 
  Row, Col, Typography, Card, Tabs, List, 
  Form, Divider, Empty, Upload, Switch 
} from 'antd';
import { 
  BookOutlined, EditOutlined, DeleteOutlined, 
  PlusOutlined, SearchOutlined, UploadOutlined 
} from '@ant-design/icons';
import { LessonModal } from './LessonModal';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const LessonManagement = ({ lessons, setLessons }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [modalType, setModalType] = useState('add');

  useEffect(() => {
    const filtered = lessons?.filter(lesson =>
      lesson.title.toLowerCase().includes(searchText.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredLessons(filtered);
  }, [searchText, lessons]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <BookOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (text) => (
        <Tag color={text === 'Beginner' ? 'blue' : text === 'Intermediate' ? 'orange' : 'red'}>
          {text}
        </Tag>
      ),
      filters: [
        { text: 'Beginner', value: 'Beginner' },
        { text: 'Intermediate', value: 'Intermediate' },
        { text: 'Advanced', value: 'Advanced' }
      ],
      onFilter: (value, record) => record.level === value
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (text) => (
        <Tag color={text ? 'green' : 'red'}>
          {text ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false }
      ],
      onFilter: (value, record) => record.active === value
    },
    {
      title: 'Content Items',
      key: 'content',
      render: (_, record) => (
        <Space>
          <Tag>{record.content.vocabulary.length} Vocabulary</Tag>
          <Tag>{record.content.dialogs.length} Dialogs</Tag>
          <Tag>{record.content.paragraphs.length} Paragraphs</Tag>
        </Space>
      )
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
              setCurrentLesson(record);
              setModalType('edit');
              setIsModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this lesson?"
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
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const handleAddLesson = () => {
    setCurrentLesson(null);
    setModalType('add');
    setIsModalVisible(true);
  };

  const handleSaveLesson = (lesson) => {
    if (modalType === 'add') {
      setLessons([...lessons, {
        ...lesson,
        id: Date.now().toString(),
        created: new Date().toISOString().split('T')[0],
        modified: new Date().toISOString().split('T')[0]
      }]);
    } else {
      setLessons(lessons.map(l => l.id === currentLesson.id ? { 
        ...l, 
        ...lesson,
        modified: new Date().toISOString().split('T')[0]
      } : l));
    }
    setIsModalVisible(false);
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>Lesson Management</Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddLesson}
            >
              Add Lesson
            </Button>
          </Col>
        </Row>
        
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Input
              placeholder="Search lessons..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        
        <Table 
          columns={columns} 
          dataSource={filteredLessons} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <LessonModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveLesson}
        lesson={currentLesson}
        type={modalType}
      />
    </div>
  );
};

export default LessonManagement;