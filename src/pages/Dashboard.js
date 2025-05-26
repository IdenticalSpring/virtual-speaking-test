import React, { useState, useEffect, useContext } from 'react';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Avatar,
  Tag,
  Space,
  Spin,
  Badge,
  Progress,
  Divider,
  Calendar,
  Alert,
  Statistic,
} from 'antd';
import {
  MessageOutlined,
  TeamOutlined,
  BookOutlined,
  ScheduleOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  AudioOutlined,
  PlayCircleOutlined,
  PauseOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './Dashboard.css';
import { AuthContext } from '../context/AuthContext';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { SubMenu } = Menu;

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const userLevel = parseInt(user.level, 10);

  const [collapsed, setCollapsed] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(userLevel);
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [isPlaying, setIsPlaying] = useState({});
  const [isRecording, setIsRecording] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [userExp, setUserExp] = useState({
    grammar: 75,
    pronunciation: 60,
    vocabulary: 85,
    fluency: 70,
  });

  // Fetch all lessons once
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/lessons`)
      .then(res => setLessons(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Compute available units for selected level
  const units = Array.from(
    new Set(
      lessons
        .filter(lesson => parseInt(lesson.level, 10) === selectedLevel && lesson.active)
        .map(lesson => lesson.unit)
    )
  ).sort((a, b) => a - b);

  // Compute chapters grouped by unit
  const chaptersByUnit = units.reduce((acc, unit) => {
    const chapters = Array.from(
      new Set(
        lessons
          .filter(l => parseInt(l.level, 10) === selectedLevel && l.unit === unit && l.active)
          .map(l => l.chapter)
      )
    ).sort((a, b) => a - b);
    acc[unit] = chapters;
    return acc;
  }, {});

  // Lessons for the active chapter
  const chapterLessons = lessons.filter(
    l =>
      parseInt(l.level, 10) === selectedLevel &&
      l.unit === activeUnit &&
      l.chapter === activeChapter &&
      l.active
  );

  // Text-to-speech helper
  const speakText = text => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      u.onstart = () => setIsPlaying(p => ({ ...p, [text]: true }));
      u.onend = () => setIsPlaying(p => ({ ...p, [text]: false }));
      window.speechSynthesis.speak(u);
    }
  };

  // Toggle recording state and simulate AI evaluation
  const toggleRecord = id => {
    setIsRecording(r => ({ ...r, [id]: !r[id] }));
    
    if (!isRecording[id]) {
      // Simulate AI evaluation after recording
      setTimeout(() => {
        const newEvaluation = {
          accuracy: Math.floor(Math.random() * 30) + 70,
          pronounUsage: Math.floor(Math.random() * 30) + 70,
          sentenceStructure: Math.floor(Math.random() * 30) + 70,
          feedback: [
            "Good job with subject-verb agreement!",
            "Try to work on your pronoun clarity.",
            "Sentence structure was mostly correct."
          ].sort(() => 0.5 - Math.random()).slice(0, 2)
        };
        setEvaluations(e => ({ ...e, [id]: newEvaluation }));
        
        // Update user experience (simulated)
        setUserExp(prev => ({
          grammar: Math.min(100, prev.grammar + 2),
          pronunciation: Math.min(100, prev.pronunciation + 1),
          vocabulary: Math.min(100, prev.vocabulary + 1),
          fluency: Math.min(100, prev.fluency + 1),
        }));
      }, 2000);
    }
  };

  // Icon map for units
  const unitIcons = {
    1: <MessageOutlined />,
    2: <TeamOutlined />,
    3: <BookOutlined />,
    4: <ScheduleOutlined />,
    5: <TrophyOutlined />,
  };

  // Experience data for pie chart
  const expData = [
    { type: 'Grammar', value: userExp.grammar, color: '#1890ff' },
    { type: 'Pronunciation', value: userExp.pronunciation, color: '#52c41a' },
    { type: 'Vocabulary', value: userExp.vocabulary, color: '#faad14' },
    { type: 'Fluency', value: userExp.fluency, color: '#f5222d' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        theme="light"
        className="dashboard-sider"
      >
        {/* Logo and user info */}
        <div className="logo">
          <Title level={4} style={{ color: '#1890ff', margin: 16 }}>
            {!collapsed ? 'English Mastery' : 'EM'}
          </Title>
        </div>
        <div className="user-profile">
          <Avatar size={collapsed ? 40 : 64} icon={<UserOutlined />} />
          {!collapsed && (
            <div className="user-info">
              <Text strong>{user.name}</Text>
              <Text type="secondary">{user.role}</Text>
            </div>
          )}
        </div>

        {/* Level selector */}
        <div style={{ padding: '0 16px', margin: '16px 0' }}>
          <Text strong>Select Level</Text>
          <Space style={{ marginTop: 8 }} wrap>
            {[1, 2, 3, 4].map(lv => (
              <Button
                key={lv}
                size="small"
                type={lv === selectedLevel ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedLevel(lv);
                  setActiveUnit(null);
                  setActiveChapter(null);
                  setOpenKeys([]);
                }}
              >
                Level {lv}
              </Button>
            ))}
          </Space>
        </div>

        {/* Sidebar Menu: Levels > Units > Chapters */}
        {selectedLevel && (
          <Menu
            theme="light"
            mode="inline"
            openKeys={openKeys}
            selectedKeys={[
              activeChapter
                ? `chapter-${activeChapter}`
                : activeUnit
                ? `unit-${activeUnit}`
                : `level-${selectedLevel}`
            ]}
            onOpenChange={setOpenKeys}
            onSelect={({ key }) => {
              const [type, id] = key.split('-');
              if (type === 'unit') {
                setActiveUnit(Number(id));
                setActiveChapter(null);
              } else if (type === 'chapter') {
                setActiveChapter(Number(id));
              }
            }}
          >
            <SubMenu key={`level-${selectedLevel}`} title={`Level ${selectedLevel}`}>  
              {units.map(unit => (
                <SubMenu
                  key={`unit-${unit}`} 
                  title={`Unit ${unit}`} 
                  icon={unitIcons[unit] || <BookOutlined />}
                  onTitleClick={() => {
                    setActiveUnit(unit);
                    setActiveChapter(null);
                  }}
                >
                  {chaptersByUnit[unit].map(chapter => (
                    <Menu.Item key={`chapter-${chapter}`}>Chapter {chapter}</Menu.Item>
                  ))}
                </SubMenu>
              ))}
            </SubMenu>
          </Menu>
        )}
      </Sider>

      {/* Main layout */}
      <Layout className="site-layout">
        {/* Header */}
        <Header className="dashboard-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>
                {activeChapter
                  ? `Chapter ${activeChapter}`
                  : activeUnit
                  ? `Unit ${activeUnit}`
                  : selectedLevel
                  ? `Level ${selectedLevel}`
                  : 'Dashboard'}
              </Title>
            </Col>
            <Col>
              <Space>
                <Badge count={3}><ClockCircleOutlined style={{ color: '#fff' }} /></Badge>
                <Badge count={5}><CheckCircleOutlined style={{ color: '#fff' }} /></Badge>
                <Avatar icon={<UserOutlined />} />
              </Space>
            </Col>
          </Row>
        </Header>

        {/* Content */}
        <Layout style={{ padding: '24px' }}>
          <Content style={{ marginRight: 24 }}>
            {loading ? (
              <Spin size="large" />
            ) : activeChapter ? (
              <Row gutter={[16, 16]}>
                {chapterLessons.map(lesson => (
                  <Col xs={24} sm={24} md={24} key={lesson.id}>
                    <Card
                      hoverable
                      title={<Text strong>{lesson.title}</Text>}
                      extra={<Tag>L{lesson.level}</Tag>}
                    >
                      <Text type="secondary">{lesson.description}</Text>
                      <div style={{ marginTop: 12 }}>
                        <Button
                          icon={<AudioOutlined />}
                          type={isRecording[lesson.id] ? 'danger' : 'default'}
                          onClick={() => toggleRecord(lesson.id)}
                          style={{ marginRight: 8 }}
                          loading={isRecording[lesson.id]}
                        >
                          {isRecording[lesson.id] ? 'Recording...' : 'Record Answer'}
                        </Button>
                        <Button
                          icon={
                            isPlaying[lesson.title]
                              ? <PauseOutlined />
                              : <PlayCircleOutlined />
                          }
                          onClick={() => speakText(lesson.title)}
                        />
                      </div>

                      {/* AI Evaluation Section */}
                      {evaluations[lesson.id] && (
                        <div style={{ marginTop: 24 }}>
                          <Divider orientation="left">AI Evaluation</Divider>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Statistic 
                                title="Accuracy" 
                                value={evaluations[lesson.id].accuracy} 
                                suffix="%" 
                              />
                              <Progress 
                                percent={evaluations[lesson.id].accuracy} 
                                status="active" 
                              />
                            </Col>
                            <Col span={8}>
                              <Statistic 
                                title="Pronoun Usage" 
                                value={evaluations[lesson.id].pronounUsage} 
                                suffix="%" 
                              />
                              <Progress 
                                percent={evaluations[lesson.id].pronounUsage} 
                                status="active" 
                              />
                            </Col>
                            <Col span={8}>
                              <Statistic 
                                title="Sentence Structure" 
                                value={evaluations[lesson.id].sentenceStructure} 
                                suffix="%" 
                              />
                              <Progress 
                                percent={evaluations[lesson.id].sentenceStructure} 
                                status="active" 
                              />
                            </Col>
                          </Row>
                          <div style={{ marginTop: 16 }}>
                            <Text strong>Feedback:</Text>
                            {evaluations[lesson.id].feedback.map((fb, i) => (
                              <Alert 
                                key={i} 
                                message={fb} 
                                type="info" 
                                showIcon 
                                style={{ marginTop: 8 }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : activeUnit ? (
              <Card title={`Select Chapter for Unit ${activeUnit}`}>
                <Row gutter={[16, 16]}>
                  {chaptersByUnit[activeUnit].map(ch => (
                    <Col xs={24} sm={12} md={8} key={ch}>
                      <Card hoverable onClick={() => setActiveChapter(ch)}>
                        <Title level={4}>Chapter {ch}</Title>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ) : (
              <Card>
                <Title level={3} style={{ textAlign: 'center' }}>
                  Please select a level and unit from the sidebar
                </Title>
              </Card>
            )}
          </Content>

          {/* Right Sidebar */}
          <Sider width={300} theme="light" style={{ background: '#fff', padding: '16px' }}>
            <Card 
              title="Your Progress" 
              bordered={false}
              extra={<PieChartOutlined />}
            >
              <Title level={5}>Experience Breakdown</Title>
              {expData.map(item => (
                <div key={item.type} style={{ marginBottom: 16 }}>
                  <Text>{item.type}</Text>
                  <Progress 
                    percent={item.value} 
                    strokeColor={item.color}
                    format={percent => `${percent}%`}
                  />
                </div>
              ))}

              <Divider />

              <Title level={5}>Level Progress</Title>
              <Progress 
                type="circle" 
                percent={Math.min(100, userLevel * 25)} 
                width={80}
                style={{ display: 'block', margin: '0 auto 16px' }}
              />
              <Text strong style={{ textAlign: 'center', display: 'block' }}>
                Level {userLevel} ({Math.min(100, userLevel * 25)}%)
              </Text>

              <Divider />

              <Title level={5}>Study Calendar</Title>
              <Calendar 
                fullscreen={false} 
                style={{ border: '1px solid #f0f0f0' }} 
              />
            </Card>
          </Sider>
        </Layout>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          ©2023 English Mastery. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}