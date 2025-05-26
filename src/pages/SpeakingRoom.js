import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Card, 
  Avatar, 
  Typography, 
  Button, 
  Row, 
  Col, 
  Space, 
  Progress, 
  Divider,
  List,
  Badge,
  message
} from 'antd';
import { 
  TeamOutlined,
  UserOutlined, 
  RobotOutlined, 
  AudioOutlined, 
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import './SpeakingRoom.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// Mock conversation data
const CONVERSATION_TEMPLATES = {
  daily: [
    { role: 'ai', content: "Hi there! How's your day going so far?" },
    { role: 'ai', content: "That's interesting! What did you do this morning?" },
    { role: 'ai', content: "Nice! Do you have any plans for the weekend?" },
    { role: 'ai', content: "Sounds fun! What's your favorite way to relax after a busy week?" }
  ],
  business: [
    { role: 'ai', content: "Good morning. Thank you for meeting with me today." },
    { role: 'ai', content: "Let's discuss the quarterly sales figures. What trends are you seeing?" },
    { role: 'ai', content: "Interesting perspective. How would you propose we address these challenges?" },
    { role: 'ai', content: "That sounds like a solid plan. When can you have the proposal ready?" }
  ]
};

// Mock evaluation criteria
const evaluateResponse = (transcript) => {
  // This would be replaced with real AI evaluation in production
  const pronunciationScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const vocabularyScore = Math.floor(Math.random() * 40) + 60;
  const grammarScore = Math.floor(Math.random() * 40) + 60;
  const fluencyScore = Math.floor(Math.random() * 40) + 60;
  
  const totalScore = Math.round((pronunciationScore + vocabularyScore + grammarScore + fluencyScore) / 4);
  
  return {
    pronunciation: pronunciationScore,
    vocabulary: vocabularyScore,
    grammar: grammarScore,
    fluency: fluencyScore,
    overall: totalScore,
    feedback: getRandomFeedback(totalScore),
    corrections: getRandomCorrections(transcript)
  };
};

const getRandomFeedback = (score) => {
  if (score >= 90) return "Excellent job! Your pronunciation was very clear and natural.";
  if (score >= 75) return "Good work! With a little more practice you'll sound even more natural.";
  if (score >= 60) return "Not bad! Here are some areas to focus on for improvement.";
  return "Keep practicing! Here are some specific areas to work on.";
};

const getRandomCorrections = (transcript) => {
  if (!transcript) return [];
  const words = transcript.split(' ');
  if (words.length < 3) return [];
  
  // Mock corrections - in a real app this would come from AI analysis
  return [
    {
      original: words[0],
      suggestion: "Try pronouncing this more like: " + words[0].toUpperCase(),
      explanation: "The vowel sound should be more open."
    },
    {
      original: words[words.length-1],
      suggestion: "A better word choice might be: " + ["great", "wonderful", "excellent"][Math.floor(Math.random()*3)],
      explanation: "This sounds more natural in this context."
    }
  ];
};

export default function SpeakingRoom() {
  const [conversation, setConversation] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const conversationEndRef = useRef(null);

  // Scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, showEvaluation]);

  // Start a new conversation
  const startConversation = (template) => {
    setActiveTemplate(template);
    setConversation([{ 
      role: 'ai', 
      content: CONVERSATION_TEMPLATES[template][0].content,
      templateIndex: 0
    }]);
    setEvaluation(null);
    setShowEvaluation(false);
    setTranscript('');
  };

  // Handle AI response (next message in template)
  const getAIResponse = () => {
    const lastMessage = conversation[conversation.length - 1];
    if (lastMessage.role === 'ai' && lastMessage.templateIndex !== undefined) {
      const nextIndex = lastMessage.templateIndex + 1;
      if (nextIndex < CONVERSATION_TEMPLATES[activeTemplate].length) {
        return {
          role: 'ai',
          content: CONVERSATION_TEMPLATES[activeTemplate][nextIndex].content,
          templateIndex: nextIndex
        };
      }
    }
    return null;
  };

  // Start recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // In a real app, you would send this to your backend for speech-to-text processing
        console.log('Audio recorded:', audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      message.info('Recording started. Speak now...');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      message.error('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording and process response
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    
    // Mock processing - in a real app you would wait for speech-to-text API response
    setTimeout(() => {
      const mockTranscript = "This is a mock transcript of what the user said. In a real app, this would come from speech-to-text API.";
      setTranscript(mockTranscript);
      
      // Add user message to conversation
      const newConversation = [...conversation, { role: 'user', content: mockTranscript }];
      setConversation(newConversation);
      
      // Evaluate response
      const evalResult = evaluateResponse(mockTranscript);
      setEvaluation(evalResult);
      setShowEvaluation(true);
      
      // Get AI response after a delay
      setTimeout(() => {
        const aiResponse = getAIResponse();
        if (aiResponse) {
          setConversation([...newConversation, aiResponse]);
          setShowEvaluation(false);
        } else {
          message.success('Conversation completed! Good job!');
        }
      }, 2000);
    }, 1000);
  };

  // Continue conversation after viewing evaluation
  const continueConversation = () => {
    setShowEvaluation(false);
    const aiResponse = getAIResponse();
    if (aiResponse) {
      setConversation([...conversation, aiResponse]);
    }
  };

  return (
    <Layout className="speaking-room-layout">
      <Header className="speaking-room-header">
        <Title level={4} style={{ color: 'white', margin: 0 }}>
          Virtual Speaking Practice
        </Title>
      </Header>
      
      <Content className="speaking-room-content">
        {/* Conversation Templates Selection */}
        {!activeTemplate && (
          <div className="template-selection">
            <Title level={3} style={{ textAlign: 'center' }}>
              Select a Conversation Type
            </Title>
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={8}>
                <Card 
                  hoverable 
                  onClick={() => startConversation('daily')}
                  cover={
                    <div style={{ padding: 24, background: '#f0f2f5', textAlign: 'center' }}>
                      <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    </div>
                  }
                >
                  <Card.Meta
                    title="Daily Conversations"
                    description="Practice casual everyday English"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card 
                  hoverable 
                  onClick={() => startConversation('business')}
                  cover={
                    <div style={{ padding: 24, background: '#f0f2f5', textAlign: 'center' }}>
                      <TeamOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    </div>
                  }
                >
                  <Card.Meta
                    title="Business English"
                    description="Practice professional workplace conversations"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Conversation Area */}
        {activeTemplate && (
          <div className="conversation-container">
            <Card className="conversation-card">
              <div className="conversation-messages">
                {conversation.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.role}`}
                  >
                    <div className="message-content">
                      <Avatar 
                        icon={msg.role === 'ai' ? <RobotOutlined /> : <UserOutlined />} 
                        style={{ 
                          backgroundColor: msg.role === 'ai' ? '#f56a00' : '#1890ff' 
                        }} 
                      />
                      <div className="message-text">
                        <Text>{msg.content}</Text>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Evaluation Panel */}
                {showEvaluation && evaluation && (
                  <div className="evaluation-panel">
                    <Divider orientation="left">Your Performance</Divider>
                    <div className="evaluation-scores">
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                          <Text strong>Overall Score:</Text>
                          <Progress 
                            percent={evaluation.overall} 
                            status={evaluation.overall >= 75 ? 'success' : evaluation.overall >= 50 ? 'normal' : 'exception'}
                            format={percent => `${percent}%`}
                          />
                        </div>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text strong>Pronunciation:</Text>
                            <Progress percent={evaluation.pronunciation} />
                          </Col>
                          <Col span={12}>
                            <Text strong>Vocabulary:</Text>
                            <Progress percent={evaluation.vocabulary} />
                          </Col>
                          <Col span={12}>
                            <Text strong>Grammar:</Text>
                            <Progress percent={evaluation.grammar} />
                          </Col>
                          <Col span={12}>
                            <Text strong>Fluency:</Text>
                            <Progress percent={evaluation.fluency} />
                          </Col>
                        </Row>
                        
                        <div>
                          <Text strong>Feedback:</Text>
                          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            {evaluation.feedback}
                          </Text>
                        </div>
                        
                        {evaluation.corrections.length > 0 && (
                          <div>
                            <Text strong>Suggestions:</Text>
                            <List
                              size="small"
                              dataSource={evaluation.corrections}
                              renderItem={item => (
                                <List.Item>
                                  <Space direction="vertical">
                                    <Text>
                                      <Text delete>{item.original}</Text> → <Text strong>{item.suggestion}</Text>
                                    </Text>
                                    <Text type="secondary">{item.explanation}</Text>
                                  </Space>
                                </List.Item>
                              )}
                            />
                          </div>
                        )}
                      </Space>
                    </div>
                    <Button 
                      type="primary" 
                      onClick={continueConversation}
                      style={{ marginTop: 16 }}
                    >
                      Continue Conversation
                    </Button>
                  </div>
                )}
                
                <div ref={conversationEndRef} />
              </div>
              
              {/* Recording Controls */}
              <div className="recording-controls">
                {!showEvaluation && (
                  <>
                    {isRecording ? (
                      <Button
                        type="primary"
                        danger
                        icon={<StopOutlined />}
                        onClick={stopRecording}
                        size="large"
                      >
                        Stop Recording
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<AudioOutlined />}
                        onClick={startRecording}
                        size="large"
                      >
                        Respond
                      </Button>
                    )}
                    {transcript && (
                      <div className="transcript">
                        <Text strong>Your response:</Text>
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                          {transcript}
                        </Text>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        )}
      </Content>
      
      <Footer className="speaking-room-footer">
        <Row justify="space-between">
          <Col>
            <Text>English Mastery - Speaking Practice</Text>
          </Col>
          <Col>
            <Space size="middle">
              <Badge dot status="success">
                <Text type="secondary">AI Active</Text>
              </Badge>
              {activeTemplate && (
                <Button 
                  onClick={() => {
                    setActiveTemplate(null);
                    setConversation([]);
                  }}
                >
                  New Conversation
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}