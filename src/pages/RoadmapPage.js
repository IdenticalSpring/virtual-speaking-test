import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Steps, 
  Progress, 
  Divider, 
  Button, 
  Tag,
  List,
  Avatar,
  Space,
  Collapse
} from 'antd';
import { 
  TrophyOutlined, 
  BookOutlined, 
  VideoCameraOutlined, 
  TeamOutlined,
  CheckCircleOutlined,
  StarOutlined,
  SoundOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Roadmap.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

const RoadmapPage = () => {
  const navigate = useNavigate();
  
  // Mock data - in a real app this would come from props or API
  const userData = {
    overallScore: 78,
    strengths: ['Fluency', 'Confidence'],
    weaknesses: ['Pronunciation', 'Grammar Accuracy'],
    recommendedLevel: 'Intermediate',
    testDate: new Date().toISOString()
  };

  const learningPath = [
    {
      title: "Foundation Building",
      duration: "2-3 weeks",
      tasks: [
        "Daily pronunciation drills (15 mins)",
        "Basic grammar review",
        "100 common phrases practice",
        "Tongue twisters exercises"
      ],
      resources: [
        { name: "Pronunciation Guide", type: "PDF", icon: <BookOutlined /> },
        { name: "Basic Grammar Course", type: "Video", icon: <VideoCameraOutlined /> }
      ]
    },
    {
      title: "Skill Development",
      duration: "3-4 weeks",
      tasks: [
        "Conversation practice (30 mins daily)",
        "Listening comprehension exercises",
        "Vocabulary expansion (10 new words daily)",
        "Record and analyze your speech"
      ],
      resources: [
        { name: "Conversation Club", type: "Community", icon: <TeamOutlined /> },
        { name: "Listening Exercises", type: "Audio", icon: <SoundOutlined /> }
      ]
    },
    {
      title: "Advanced Mastery",
      duration: "4-6 weeks",
      tasks: [
        "Debate and discussion practice",
        "Idioms and advanced expressions",
        "Accent refinement",
        "Public speaking simulations"
      ],
      resources: [
        { name: "Advanced Speaking Course", type: "Video", icon: <VideoCameraOutlined /> },
        { name: "Speech Analysis Tool", type: "App", icon: <SoundOutlined /> }
      ]
    }
  ];

  const dailyPlan = [
    { time: "Morning", activity: "Pronunciation Drills (15 mins)", icon: <SoundOutlined /> },
    { time: "Afternoon", activity: "Vocabulary Practice (10 mins)", icon: <BookOutlined /> },
    { time: "Evening", activity: "Conversation Practice (20 mins)", icon: <TeamOutlined /> },
    { time: "Night", activity: "Listening Exercise (15 mins)", icon: <SoundOutlined /> }
  ];

  const improvementTips = [
    "Record yourself speaking and compare with native speakers",
    "Practice with tongue twisters to improve articulation",
    "Shadow native speakers by repeating immediately after them",
    "Focus on problem sounds identified in your test",
    "Join English speaking clubs or conversation groups",
    "Think in English to reduce translation time"
  ];

  return (
    <div className="roadmap-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Row justify="center">
          <Col xs={24} lg={22}>
            {/* Header Section */}
            <Card className="roadmap-header-card">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={8} className="text-center">
                  <Progress
                    type="circle"
                    percent={userData.overallScore}
                    strokeColor={{
                      '0%': '#ff4d4f',
                      '50%': '#faad14',
                      '100%': '#52c41a',
                    }}
                    width={150}
                    format={percent => (
                      <Title level={2} style={{ margin: 0 }}>{percent}</Title>
                    )}
                  />
                  <Text strong>Overall Score</Text>
                </Col>
                <Col xs={24} md={16}>
                  <Title level={3}>Your Personalized English Speaking Roadmap</Title>
                  <Paragraph>
                    Based on your test results, we've created this customized learning path to help 
                    you improve your English speaking skills effectively.
                  </Paragraph>
                  
                  <Space size={[8, 16]} wrap>
                    <Tag icon={<TrophyOutlined />} color="gold">Level: {userData.recommendedLevel}</Tag>
                    <Tag icon={<StarOutlined />} color="green">Strengths: {userData.strengths.join(', ')}</Tag>
                    <Tag icon={<CheckCircleOutlined />} color="red">Focus Areas: {userData.weaknesses.join(', ')}</Tag>
                  </Space>
                </Col>
              </Row>
            </Card>
            
            <Divider />
            
            {/* Learning Path Section */}
            <Card title="Your 3-Month Learning Journey" className="learning-path-card">
              <Steps direction="vertical" current={0}>
                {learningPath.map((stage, index) => (
                  <Step 
                    key={index}
                    title={
                      <Space>
                        <Text strong>{stage.title}</Text>
                        <Tag icon={<ScheduleOutlined />}>{stage.duration}</Tag>
                      </Space>
                    }
                    description={
                      <Collapse bordered={false} className="stage-collapse">
                        <Panel header="View Tasks and Resources" key={index}>
                          <div className="stage-content">
                            <div className="stage-tasks">
                              <Title level={5}>Key Tasks:</Title>
                              <List
                                size="small"
                                dataSource={stage.tasks}
                                renderItem={item => (
                                  <List.Item>
                                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                    {item}
                                  </List.Item>
                                )}
                              />
                            </div>
                            <div className="stage-resources">
                              <Title level={5}>Recommended Resources:</Title>
                              <List
                                size="small"
                                dataSource={stage.resources}
                                renderItem={resource => (
                                  <List.Item>
                                    <Avatar size="small" icon={resource.icon} />
                                    <Text strong style={{ marginLeft: 8 }}>{resource.name}</Text>
                                    <Tag style={{ marginLeft: 8 }}>{resource.type}</Tag>
                                  </List.Item>
                                )}
                              />
                            </div>
                          </div>
                        </Panel>
                      </Collapse>
                    }
                  />
                ))}
              </Steps>
            </Card>
            
            <Divider />
            
            {/* Daily Practice Plan */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Daily Practice Plan" className="daily-plan-card">
                  <List
                    itemLayout="horizontal"
                    dataSource={dailyPlan}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={item.icon} />}
                          title={<Text strong>{item.time}</Text>}
                          description={item.activity}
                        />
                      </List.Item>
                    )}
                  />
                  <div className="text-center" style={{ marginTop: 16 }}>
                    <Button type="primary">Download Daily Plan</Button>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card title="Improvement Tips" className="tips-card">
                  <List
                    dataSource={improvementTips}
                    renderItem={(tip, index) => (
                      <List.Item>
                        <Text>{index + 1}. {tip}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
            
            <Divider />
            
            {/* Action Section */}
            <div className="text-center">
              <Space size="large">
                <Button size="large" onClick={() => navigate('/trial')}>
                  Retake Speaking Test
                </Button>
                <Button type="primary" size="large" onClick={() => navigate('/user-dashboard')}>
                  Start Your First Lesson
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default RoadmapPage;