import React, { useState } from 'react';
import { 
  Modal, Form, Input, Select, Button, Tabs, 
  List, Card, Divider, Empty, Upload, Switch, 
  Row, Col, Statistic, Progress, Typography 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, UploadOutlined 
} from '@ant-design/icons';
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

export const LessonModal = ({ visible, onCancel, onSave, lesson, type }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [content, setContent] = useState({
    vocabulary: [],
    dialogs: [],
    paragraphs: [],
    images: []
  });

  const addContentItem = (type) => {
    const newItem = { id: Date.now().toString() };
    if (type === 'vocabulary') {
      newItem.word = '';
      newItem.definition = '';
    } else if (type === 'dialogs') {
      newItem.speaker1 = '';
      newItem.text1 = '';
      newItem.speaker2 = '';
      newItem.text2 = '';
    } else if (type === 'paragraphs') {
      newItem.text = '';
    } else if (type === 'images') {
      newItem.url = '';
      newItem.caption = '';
    }
    
    setContent(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
  };

  const updateContentItem = (type, id, field, value) => {
    setContent(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeContentItem = (type, id) => {
    setContent(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  return (
    <Modal
      title={type === 'add' ? 'Add New Lesson' : 'Edit Lesson'}
      visible={visible}
      onOk={() => {
        form.validateFields().then(values => {
          onSave({ ...values, content });
          form.resetFields();
        });
      }}
      onCancel={onCancel}
      okText={type === 'add' ? 'Add Lesson' : 'Save Changes'}
      cancelText="Cancel"
      width={800}
    >
      <Form form={form} layout="vertical" initialValues={lesson || {}}>
        <Form.Item
          name="title"
          label="Lesson Title"
          rules={[{ required: true, message: 'Please input the lesson title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="level"
          label="Level"
          rules={[{ required: true, message: 'Please select a level!' }]}
        >
          <Select>
            <Option value="Beginner">Beginner</Option>
            <Option value="Intermediate">Intermediate</Option>
            <Option value="Advanced">Advanced</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
      
      <Divider orientation="left">Lesson Content</Divider>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Vocabulary" key="vocabulary">
          <Button 
            type="dashed" 
            onClick={() => addContentItem('vocabulary')}
            icon={<PlusOutlined />}
            style={{ marginBottom: 16 }}
          >
            Add Vocabulary
          </Button>
          {content.vocabulary.length > 0 ? (
            <List
              dataSource={content.vocabulary}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <Form.Item label="Word">
                      <Input
                        value={item.word}
                        onChange={e => updateContentItem('vocabulary', item.id, 'word', e.target.value)}
                        placeholder="Enter word"
                      />
                    </Form.Item>
                    <Form.Item label="Definition">
                      <Input
                        value={item.definition}
                        onChange={e => updateContentItem('vocabulary', item.id, 'definition', e.target.value)}
                        placeholder="Enter definition"
                      />
                    </Form.Item>
                    <Button 
                      danger 
                      size="small" 
                      icon={<DeleteOutlined />}
                      onClick={() => removeContentItem('vocabulary', item.id)}
                    >
                      Remove
                    </Button>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No vocabulary items added yet" />
          )}
        </TabPane>
        
        {/* Similar tabs for dialogs, paragraphs, and images */}
      </Tabs>
    </Modal>
  );
};
