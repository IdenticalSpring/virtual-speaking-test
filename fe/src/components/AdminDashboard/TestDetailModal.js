import React, { useState } from 'react';
import { 
  Modal, Form, Input, Select, Button, Tabs, 
  List, Card, Divider, Empty, Upload, Switch, 
  Row, Col, Statistic, Progress, Typography 
} from 'antd';
const { Text, Title } = Typography;

export const TestDetailsModal = ({ visible, onCancel, test }) => {
  return (
    <Modal
      title="Test Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>
      ]}
      width={700}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="Overall Score" value={test?.overallScore} suffix="/100" />
        </Col>
        <Col span={8}>
          <Statistic title="Pronunciation" value={test?.pronunciation} suffix="/100" />
        </Col>
        <Col span={8}>
          <Statistic title="Fluency" value={test?.fluency} suffix="/100" />
        </Col>
      </Row>
      <Divider />
      <Text strong>Feedback:</Text>
      <Card style={{ marginTop: 8, marginBottom: 16 }}>
        <Text>{test?.feedback}</Text>
      </Card>
      <Title level={5}>Detailed Word Analysis:</Title>
      <List
        dataSource={test?.details}
        renderItem={item => (
          <List.Item>
            <Card size="small" style={{ width: '100%' }}>
              <Row gutter={16} align="middle">
                <Col span={4}>
                  <Text strong>{item.word}</Text>
                </Col>
                <Col span={4}>
                  <Progress 
                    percent={item.score} 
                    size="small" 
                    strokeColor={item.score > 70 ? '#52c41a' : item.score > 50 ? '#faad14' : '#ff4d4f'}
                  />
                </Col>
                <Col span={16}>
                  <Text type="secondary">{item.feedback}</Text>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </Modal>
  );
};