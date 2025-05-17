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
  Progress,
  Divider,
  Calendar,
  Tag,
  Space,
  Statistic,
  Badge,
  Spin,
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
} from '@ant-design/icons';
import axios from 'axios';
import './Dashboard.css';
import { AuthContext } from '../context/AuthContext';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
    useEffect(() => {
    axios.post("http://localhost:5000/speak")
      .then((res) => {
        setGeminiFeedback(res.data.feedback_gemini);

      })
      .catch((err) => {
        setGeminiFeedback(res.data.feedback_gemini);

      });
  }, []);

  const { user } = useContext(AuthContext);
  const userLevel = parseInt(user.level, 10);

  const [collapsed, setCollapsed] = useState(false);
  const [activeUnit, setActiveUnit] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(userLevel);

  const [lessons, setLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const [isPlaying, setIsPlaying] = useState({});
  const [isRecording, setIsRecording] = useState({});
  const [geminiFeedback, setGeminiFeedback] = useState("");


  // Units config
  const allUnits = [
    { key: '1', title: 'Daily Conversations', icon: <MessageOutlined />, minLevel: 1 },
    { key: '2', title: 'Business English',     icon: <TeamOutlined />,    minLevel: 2 },
    { key: '3', title: 'Academic Discussions', icon: <BookOutlined />,    minLevel: 3 },
    { key: '4', title: 'Travel Phrases',       icon: <ScheduleOutlined />,minLevel: 1 },
    { key: '5', title: 'Job Interviews',       icon: <TrophyOutlined />,  minLevel: 2 },
  ];
  const units = allUnits.filter(u => u.minLevel <= selectedLevel);

  // Fetch lessons when activeUnit changes
  useEffect(() => {
    if (!activeUnit) return;
    setLoadingLessons(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/lessons`, { params: { unit: activeUnit } })
      .then(res => {
        const data = res.data;
        setLessons(data);
        const uniq = Array.from(new Set(data.map(l => l.chapter))).sort((a, b) => a - b);
        setChapters(uniq);
        setCurrentChapter(uniq[0] || null);
      })
      .finally(() => setLoadingLessons(false));
  }, [activeUnit]);

  // Text-to-speech
  const speakText = text => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.9;
      u.onstart = () => setIsPlaying(p => ({ ...p, [text]: true }));
      u.onend   = () => setIsPlaying(p => ({ ...p, [text]: false }));
      window.speechSynthesis.speak(u);
    }
  };

  // Toggle mock recording
  const toggleRecord = id => {
    setIsRecording(r => ({ ...r, [id]: !r[id] }));
  };

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

        <Menu
          theme="light"
          selectedKeys={[activeUnit]}
          mode="inline"
          onSelect={({ key }) => setActiveUnit(key)}
          className="units-menu"
        >
          {units.map(unit => (
            <Menu.Item key={unit.key} icon={unit.icon}>
              <Space>
                {unit.title}
                <Tag color={unit.minLevel === 1 ? 'blue' : unit.minLevel === 2 ? 'orange' : 'red'}>
                  L{unit.minLevel}
                </Tag>
              </Space>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="dashboard-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ color: 'white', margin: 0 }}>
                {units.find(u => u.key === activeUnit)?.title || 'Select a Unit'}
              </Title>
            </Col>
            <Col>
              <Space size="large">
                <Badge count={3} size="small">
                  <ClockCircleOutlined style={{ color: 'white' }} />
                </Badge>
                <Badge count={5} size="small">
                  <CheckCircleOutlined style={{ color: 'white' }} />
                </Badge>
                <Avatar icon={<UserOutlined />} />
              </Space>
            </Col>
          </Row>
        </Header>

        <Content className="dashboard-content">
          <Row gutter={[16, 16]}>
            {/* Lessons Area */}
            <Col xs={24} lg={16}>
              <Card className="lesson-card" style={{ minHeight: 400 }}>
                {!activeUnit ? (
                  <Title level={3}>Please choose a unit</Title>
                ) : (
                  <>
                    <Space style={{ marginBottom: 16 }}>
                      {chapters.map(ch => (
                        <Button
                          key={ch}
                          type={ch === currentChapter ? 'primary' : 'default'}
                          onClick={() => setCurrentChapter(ch)}
                        >
                          Chapter {ch}
                        </Button>
                      ))}
                    </Space>

                    {loadingLessons ? (
                      <Spin />
                    ) : (
                      <Row gutter={[16, 16]}>
                        {lessons
                          .filter(l => l.chapter === currentChapter)
                          .map(lesson => (
                            <Col xs={24} sm={12} key={lesson.id}>
                              <Card
                                hoverable
                                title={<Text strong>{lesson.title}</Text>}
                                extra={<Tag>U{lesson.unit}</Tag>}
                              >
                                <Text type="secondary">{lesson.description}</Text>
                                <div style={{ marginTop: 12 }}>
                                  <Button
                                    icon={<AudioOutlined />}
                                    type={isRecording[lesson.id] ? 'danger' : 'default'}
                                    onClick={() => toggleRecord(lesson.id)}
                                    style={{ marginRight: 8 }}
                                  >
                                    {isRecording[lesson.id] ? 'Stop' : 'Record'}
                                  </Button>
                                  <Button
                                    icon={
                                      isPlaying[lesson.id] ? <PauseOutlined /> : <PlayCircleOutlined />
                                    }
                                    onClick={() => speakText(lesson.title)}
                                  />
                                </div>
                              </Card>
                            </Col>
                          ))}
                      </Row>
                    )}
                  </>
                )}
              </Card>
            </Col>

            {/* Right Sidebar */}
            <Col xs={24} lg={8}>
              <Card className="stats-card">
                {/* ───── Level Picker ───── */}
                <Title level={5}>Select Level</Title>
                <Space style={{ marginBottom: 16 }}>
                  {[1, 2, 3, 4].map(lv => (
                    <Button
                      key={lv}
                      type={lv === selectedLevel ? 'primary' : 'default'}
                      onClick={() => setSelectedLevel(lv)}
                    >
                      Level {lv}
                    </Button>
                  ))}
                </Space>
                <Divider/>
                  <Divider />
                      <Title level={5}>Feedback từ Gemini</Title>
                      <Text type="secondary">
                        {geminiFeedback || "Đang lấy phản hồi..."}
                      </Text>

                <Title level={4}>Your Progress</Title>
                <Statistic
                  title="Completion"
                  value={Math.round(
                    (lessons.length
                      ? lessons.filter(l => l.chapter <= currentChapter).length
                      : 0) *
                      100 /
                      (chapters.length || 1)
                  )}
                  suffix="%"
                />
                <Divider />
                <Title level={5}>Skill Breakdown</Title>
                <Progress percent={user.accuracy} status="active" />
                <Progress percent={user.pronunciation} status="active" />
                <Progress percent={user.fluency} status="active" />
              </Card>

              <Card className="calendar-card" style={{ marginTop: 16 }}>
                <Calendar fullscreen={false} />
              </Card>
            </Col>
          </Row>
        </Content>

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
}
