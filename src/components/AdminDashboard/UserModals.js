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

// User Modal
export const UserModal = ({ visible, onCancel, onSave, user, type }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={type === 'add' ? 'Add New User' : 'Edit User'}
      visible={visible}
      onOk={() => {
        form.validateFields().then(values => {
          onSave(values);
          form.resetFields();
        });
      }}
      onCancel={onCancel}
      okText={type === 'add' ? 'Add User' : 'Save Changes'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" initialValues={user || {}}>
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please input the user name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'Please input a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="student">Student</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
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
      </Form>
    </Modal>
  );
};
