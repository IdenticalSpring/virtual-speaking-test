import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Row, 
  Col, 
  Progress, 
  Typography, 
  Avatar, 
  Divider, 
  Steps, 
  Modal,
  message,
  Space,
  Tooltip
} from 'antd';
import { 
  SoundOutlined, 
  PauseOutlined, 
  PlayCircleOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  UserOutlined,
  AudioOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SpeakingTest.css';

const { Title, Text } = Typography;
const { Step } = Steps;

const wordList = [
  "Sustainability",
  "Entrepreneurship",
  "Globalization",
  "Infrastructure",
  "Biodiversity",
  "Cryptocurrency",
  "Artificial Intelligence",
  "Philanthropy",
  "Innovation",
  "Resilience"
];

const SpeakingTestPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [timer, setTimer] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Text-to-speech function
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      message.error('Text-to-speech not supported in your browser');
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Simulate AI processing
        setTimeout(() => {
          generateAiFeedback(wordList[currentWordIndex]);
        }, 1500);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      message.error('Error accessing microphone: ' + err.message);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      stopTimer();
    }
  };

  // Play recorded audio
  const playRecordedAudio = () => {
    if (recordedAudio && audioRef.current) {
      audioRef.current.play();
    }
  };

  // Timer functions
  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  // Generate mock AI feedback
  const generateAiFeedback = (word) => {
    const feedback = {
      word: word,
      pronunciationScore: Math.floor(Math.random() * 30) + 70, // 70-100
      fluencyScore: Math.floor(Math.random() * 30) + 70,
      accuracyScore: Math.floor(Math.random() * 30) + 70,
      feedbackText: [
        `You pronounced "${word}" ${Math.random() > 0.5 ? 'well' : 'with some minor errors'}.`,
        `Try ${Math.random() > 0.5 ? 'emphasizing the second syllable more' : 'shortening the vowel sounds'}.`,
        `Your fluency is ${Math.random() > 0.5 ? 'good' : 'improving'}, keep practicing!`
      ].join(' '),
      timestamp: new Date().toISOString()
    };
    setAiFeedback(feedback);
    setUserResponses(prev => [...prev, feedback]);
  };

  // Start test
  const startTest = () => {
    setTestStarted(true);
    speakWord(wordList[currentWordIndex]);
  };

  // Next word
  const nextWord = () => {
    if (currentWordIndex < wordList.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setRecordedAudio(null);
      setAiFeedback(null);
      speakWord(wordList[currentWordIndex + 1]);
    } else {
      setShowResults(true);
    }
  };

  // Retry current word
  const retryWord = () => {
    setRecordedAudio(null);
    setAiFeedback(null);
    speakWord(wordList[currentWordIndex]);
  };

  // Complete test
  const completeTest = () => {
    Modal.confirm({
      title: 'Complete Speaking Test',
      content: 'Are you ready to see your results and learning roadmap?',
      okText: 'Yes, show me',
      cancelText: 'Not yet',
      onOk: () => navigate('/roadmap')
    });
  };

  // Calculate overall score
  const calculateOverallScore = () => {
    if (userResponses.length === 0) return 0;
    const total = userResponses.reduce((sum, response) => {
      return sum + (response.pronunciationScore + response.fluencyScore + response.accuracyScore) / 3;
    }, 0);
    return Math.round(total / userResponses.length);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
      clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="speaking-test-container">
      <audio ref={audioRef} src={recordedAudio} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="test-content"
      >
        <Row justify="center">
          <Col xs={24} md={20} lg={16}>
            <Card className="test-card">
              {/* Progress Header */}
              <div className="test-header">
                <Progress 
                  percent={(currentWordIndex / wordList.length) * 100} 
                  showInfo={false} 
                  strokeColor="#1890ff"
                />
                <Text strong>{currentWordIndex + 1} of {wordList.length}</Text>
              </div>
              
              <Divider />
              
              {/* Test Steps */}
              <Steps current={currentStep} className="test-steps">
                <Step title="Listen" />
                <Step title="Repeat" />
                <Step title="Feedback" />
              </Steps>
              
              <Divider />
              
              {/* Main Test Area */}
              {!testStarted ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="test-start-section"
                >
                  <Title level={3} className="text-center">English Speaking Test</Title>
                  <Text className="text-center block mb-8">
                    This test will evaluate your pronunciation, fluency, and accuracy.<br />
                    You'll be asked to repeat {wordList.length} words after hearing them.
                  </Text>
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        type="primary" 
                        size="large" 
                        icon={<AudioOutlined />}
                        onClick={startTest}
                      >
                        Bắt đầu kiểm tra
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : showResults ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="test-results"
                >
                  <Title level={3} className="text-center">Test Results</Title>
                  
                  <div className="overall-score">
                    <Progress
                      type="circle"
                      percent={calculateOverallScore()}
                      strokeColor={{
                        '0%': '#ff4d4f',
                        '100%': '#52c41a',
                      }}
                      format={percent => (
                        <div className="score-text">
                          <Title level={2}>{percent}</Title>
                          <Text>Overall Score</Text>
                        </div>
                      )}
                      width={200}
                    />
                  </div>
                  
                  <Divider />
                  
                  <Title level={4}>Detailed Feedback</Title>
                  <div className="feedback-list">
                    {userResponses.map((response, index) => (
                      <Card key={index} className="feedback-card">
                        <div className="feedback-header">
                          <Text strong>Word {index + 1}:</Text>
                          <Text code>{response.word}</Text>
                        </div>
                        <div className="feedback-metrics">
                          <div className="metric">
                            <Text type="secondary">Pronunciation</Text>
                            <Progress 
                              percent={response.pronunciationScore} 
                              status={response.pronunciationScore >= 80 ? 'success' : 'normal'}
                              strokeColor={response.pronunciationScore >= 80 ? '#52c41a' : '#1890ff'}
                            />
                          </div>
                          <div className="metric">
                            <Text type="secondary">Fluency</Text>
                            <Progress 
                              percent={response.fluencyScore} 
                              status={response.fluencyScore >= 80 ? 'success' : 'normal'}
                              strokeColor={response.fluencyScore >= 80 ? '#52c41a' : '#1890ff'}
                            />
                          </div>
                          <div className="metric">
                            <Text type="secondary">Accuracy</Text>
                            <Progress 
                              percent={response.accuracyScore} 
                              status={response.accuracyScore >= 80 ? 'success' : 'normal'}
                              strokeColor={response.accuracyScore >= 80 ? '#52c41a' : '#1890ff'}
                            />
                          </div>
                        </div>
                        <Text className="feedback-text">{response.feedbackText}</Text>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center mt-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        type="primary" 
                        size="large" 
                        onClick={completeTest}
                        icon={<ArrowRightOutlined />}
                      >
                        View Learning Roadmap
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className="test-main">
                  {/* Current Word Display */}
                  <motion.div
                    key={currentWordIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="word-display"
                  >
                    <Title level={1} className="text-center current-word">
                      {wordList[currentWordIndex]}
                    </Title>
                    
                    <div className="text-center">
                      <Tooltip title="Play word again">
                        <Button 
                          shape="circle" 
                          icon={isPlaying ? <PauseOutlined /> : <SoundOutlined />} 
                          onClick={() => speakWord(wordList[currentWordIndex])}
                          size="large"
                          className="play-button"
                        />
                      </Tooltip>
                    </div>
                  </motion.div>
                  
                  {/* Recording Section */}
                  {!recordedAudio ? (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="recording-section"
                    >
                      <div className="text-center mb-4">
                        <Text strong>Press and hold to record your voice</Text>
                      </div>
                      <div className="text-center">
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          className="record-button-container"
                        >
                          <Button
                            type={isRecording ? 'danger' : 'primary'}
                            shape="circle"
                            size="large"
                            className="record-button"
                            icon={<AudioOutlined />}
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                          />
                        </motion.div>
                        {isRecording && (
                          <div className="recording-indicator">
                            <div className="pulse"></div>
                            <Text type="danger">Recording... {timer}s</Text>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    /* Feedback Section */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="feedback-section"
                    >
                      <div className="feedback-audio">
                        <Title level={4} className="text-center">Your Recording</Title>
                        <div className="text-center">
                          <Button 
                            icon={<PlayCircleOutlined />} 
                            onClick={playRecordedAudio}
                          >
                            Play Back
                          </Button>
                        </div>
                      </div>
                      
                      {aiFeedback && (
                        <div className="ai-feedback">
                          <Title level={4} className="text-center">AI Feedback</Title>
                          <Card className="feedback-card">
                            <div className="feedback-scores">
                              <div className="score-item">
                                <Text strong>Pronunciation</Text>
                                <Progress 
                                  percent={aiFeedback.pronunciationScore} 
                                  status={aiFeedback.pronunciationScore >= 80 ? 'success' : 'normal'}
                                />
                              </div>
                              <div className="score-item">
                                <Text strong>Fluency</Text>
                                <Progress 
                                  percent={aiFeedback.fluencyScore} 
                                  status={aiFeedback.fluencyScore >= 80 ? 'success' : 'normal'}
                                />
                              </div>
                              <div className="score-item">
                                <Text strong>Accuracy</Text>
                                <Progress 
                                  percent={aiFeedback.accuracyScore} 
                                  status={aiFeedback.accuracyScore >= 80 ? 'success' : 'normal'}
                                />
                              </div>
                            </div>
                            <Divider />
                            <Text>{aiFeedback.feedbackText}</Text>
                          </Card>
                        </div>
                      )}
                      
                      <div className="action-buttons">
                        <Space>
                          <Button 
                            icon={<RedoOutlined />} 
                            onClick={retryWord}
                          >
                            Try Again
                          </Button>
                          <Button 
                            type="primary" 
                            icon={<ArrowRightOutlined />} 
                            onClick={nextWord}
                          >
                            {currentWordIndex < wordList.length - 1 ? 'Next Word' : 'Finish Test'}
                          </Button>
                        </Space>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default SpeakingTestPage;