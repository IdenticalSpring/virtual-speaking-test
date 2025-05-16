import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Avatar, 
  Progress, 
  Divider, 
  List, 
  Calendar,
  Tag,
  Tabs,
  Space,
  Statistic,
  Badge
} from 'antd';
import { 
  SoundOutlined, 
  UserOutlined, 
  BookOutlined, 
  TrophyOutlined,
  TeamOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AudioOutlined,
  PlayCircleOutlined,
  PauseOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import './Dashboard.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeUnit, setActiveUnit] = useState('unit1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('vocabulary');
  
  // Mock data
  const userProgress = {
    level: 'Intermediate',
    completion: 68,
    streak: 12,
    accuracy: 74,
    pronunciation: 65,
    fluency: 72
  };

  const units = [
    { key: 'unit1', title: 'Daily Conversations', icon: <MessageOutlined />, level: 'Beginner' },
    { key: 'unit2', title: 'Business English', icon: <TeamOutlined />, level: 'Intermediate' },
    { key: 'unit3', title: 'Academic Discussions', icon: <BookOutlined />, level: 'Advanced' },
    { key: 'unit4', title: 'Travel Phrases', icon: <ScheduleOutlined />, level: 'Beginner' },
    { key: 'unit5', title: 'Job Interviews', icon: <TrophyOutlined />, level: 'Intermediate' }
  ];

  const vocabulary = [
    { word: "Sustainability", definition: "The ability to maintain at a certain rate or level" },
    { word: "Entrepreneurship", definition: "The activity of setting up a business" },
    { word: "Globalization", definition: "The process of international integration" }
  ];

  const dialog = [
    { speaker: "Sarah", text: "How was your weekend?" },
    { speaker: "John", text: "It was great! I went hiking with some friends." },
    { speaker: "Sarah", text: "That sounds wonderful. Where did you go?" }
  ];

  const paragraph = "Globalization has led to increased interconnectedness between countries. This has created opportunities for cultural exchange and economic growth, but also presents challenges such as environmental concerns and economic inequality. Many believe we need sustainable development to balance these factors.";

  const evaluations = [
    { word: "Sustainability", score: 72, feedback: "Try emphasizing the second syllable more" },
    { word: "Entrepreneurship", score: 65, feedback: "Practice the 'eur' sound in the middle" },
    { word: "Globalization", score: 68, feedback: "Work on the 'gl' consonant blend" }
  ];

  const upcomingLessons = [
    { date: "2023-06-15", title: "Business Meeting Practice", time: "10:00 AM" },
    { date: "2023-06-16", title: "Pronunciation Workshop", time: "2:00 PM" },
    { date: "2023-06-18", title: "Conversation Club", time: "4:30 PM" }
  ];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Actual recording implementation would go here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording implementation would go here
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        width={250}
        theme="light"
        className="dashboard-sider"
      >
        <div className="logo">
          <Title level={4} style={{ color: '#1890ff', margin: 16 }}>
            {!collapsed ? 'English Mastery' : 'EM'}
          </Title>
        </div>
        
        <div className="user-profile">
          <Avatar size={collapsed ? 40 : 64} icon={<UserOutlined />} />
          {!collapsed && (
            <div className="user-info">
              <Text strong>Alex Johnson</Text>
              <Text type="secondary">Intermediate Learner</Text>
            </div>
          )}
        </div>
        
        <Menu
          theme="light"
          defaultSelectedKeys={[activeUnit]}
          mode="inline"
          onSelect={({ key }) => setActiveUnit(key)}
          className="units-menu"
        >
          {units.map(unit => (
            <Menu.Item key={unit.key} icon={unit.icon}>
              <Space>
                {unit.title}
                <Tag color={unit.level === 'Beginner' ? 'blue' : unit.level === 'Intermediate' ? 'orange' : 'red'}>
                  {unit.level}
                </Tag>
              </Space>
            </Menu.Item>
          ))}
        </Menu>
        
        {!collapsed && (
          <div className="progress-summary">
            <Progress 
              percent={userProgress.completion} 
              status="active" 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text>Course Completion</Text>
          </div>
        )}
      </Sider>

      <Layout className="site-layout">
        {/* Header */}
        <Header className="dashboard-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ color: 'white', margin: 0 }}>
                {units.find(u => u.key === activeUnit)?.title || 'Dashboard'}
              </Title>
            </Col>
            <Col>
              <Space size="large">
                <Badge count={3} size="small">
                  <Button type="text" icon={<ClockCircleOutlined style={{ color: 'white' }} />} />
                </Badge>
                <Badge count={5} size="small">
                  <Button type="text" icon={<CheckCircleOutlined style={{ color: 'white' }} />} />
                </Badge>
                <Avatar icon={<UserOutlined />} />
              </Space>
            </Col>
          </Row>
        </Header>

        {/* Main Content */}
        <Content className="dashboard-content">
          <Row gutter={[16, 16]}>
            {/* Left Main Content - Lesson Area */}
            <Col xs={24} lg={16}>
              <Card className="lesson-card">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                  <TabPane tab="Vocabulary" key="vocabulary">
                    <List
                      dataSource={vocabulary}
                      renderItem={item => (
                        <List.Item>
                          <Card className="word-card">
                            <Title level={5}>{item.word}</Title>
                            <Text type="secondary">{item.definition}</Text>
                            <div className="action-buttons">
                              <Button 
                                icon={isPlaying ? <PauseOutlined /> : <SoundOutlined />} 
                                onClick={() => speakText(item.word)}
                              >
                                Hear Pronunciation
                              </Button>
                              <Button 
                                type={isRecording ? 'danger' : 'default'} 
                                icon={<AudioOutlined />}
                                onClick={isRecording ? stopRecording : startRecording}
                              >
                                {isRecording ? 'Stop Recording' : 'Record Your Voice'}
                              </Button>
                              <Button type="primary">Evaluate</Button>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                  
                  <TabPane tab="Dialog" key="dialog">
                    <Card className="dialog-card">
                      {dialog.map((line, index) => (
                        <div key={index} className="dialog-line">
                          <Text strong>{line.speaker}:</Text>
                          <Paragraph>{line.text}</Paragraph>
                          <Space>
                            <Button 
                              size="small" 
                              icon={<SoundOutlined />} 
                              onClick={() => speakText(line.text)}
                            />
                            <Button 
                              size="small" 
                              icon={<AudioOutlined />}
                              onClick={isRecording ? stopRecording : startRecording}
                              danger={isRecording}
                            >
                              {isRecording ? 'Recording...' : 'Record'}
                            </Button>
                          </Space>
                        </div>
                      ))}
                      <Divider />
                      <Button type="primary">Evaluate Full Dialog</Button>
                    </Card>
                  </TabPane>
                  
                  <TabPane tab="Paragraph" key="paragraph">
                    <Card className="paragraph-card">
                      <Paragraph>{paragraph}</Paragraph>
                      <div className="action-buttons">
                        <Button 
                          icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />} 
                          onClick={() => speakText(paragraph)}
                        >
                          {isPlaying ? 'Pause' : 'Play Paragraph'}
                        </Button>
                        <Button 
                          type={isRecording ? 'danger' : 'default'} 
                          icon={<AudioOutlined />}
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          {isRecording ? 'Stop Recording' : 'Record Your Reading'}
                        </Button>
                        <Button type="primary">Get Evaluation</Button>
                      </div>
                      
                      {evaluations.length > 0 && (
                        <div className="evaluation-results">
                          <Title level={5} style={{ marginTop: 16 }}>Last Evaluation Results</Title>
                          <List
                            dataSource={evaluations}
                            renderItem={item => (
                              <List.Item>
                                <Progress 
                                  type="circle" 
                                  percent={item.score} 
                                  width={50}
                                  strokeColor={item.score > 70 ? '#52c41a' : item.score > 50 ? '#faad14' : '#ff4d4f'}
                                />
                                <div style={{ marginLeft: 16 }}>
                                  <Text strong>{item.word}</Text>
                                  <Text type="secondary" style={{ display: 'block' }}>{item.feedback}</Text>
                                </div>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                    </Card>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            
            {/* Right Sidebar - Stats and Calendar */}
            <Col xs={24} lg={8}>
              <Card className="stats-card">
                <Title level={4}>Your Progress</Title>
                
                <Statistic 
                  title="Current Streak" 
                  value={userProgress.streak} 
                  prefix={<TrophyOutlined />}
                  suffix="days"
                />
                
                <Divider />
                
                <Title level={5}>Skill Breakdown</Title>
                <div className="skill-metrics">
                  <Progress percent={userProgress.accuracy} status="active" format={() => 'Accuracy'} />
                  <Progress percent={userProgress.pronunciation} status="active" format={() => 'Pronunciation'} />
                  <Progress percent={userProgress.fluency} status="active" format={() => 'Fluency'} />
                </div>
                
                <Divider />
                
                <Title level={5}>Upcoming Lessons</Title>
                <List
                  dataSource={upcomingLessons}
                  renderItem={item => (
                    <List.Item>
                      <Text strong>{item.title}</Text>
                      <div>
                        <Text type="secondary">{item.date}</Text>
                        <Text type="secondary" style={{ display: 'block' }}>{item.time}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
              
              <Card className="calendar-card" style={{ marginTop: 16 }}>
                <Calendar fullscreen={false} />
              </Card>
            </Col>
          </Row>
        </Content>

        {/* Footer */}
        <Footer className="dashboard-footer">
          <Row justify="space-between">
            <Col>
              <Text>© 2023 English Mastery. All rights reserved.</Text>
            </Col>
            <Col>
              <Space size="middle">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Us</a>
              </Space>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;