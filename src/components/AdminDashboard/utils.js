export const generateMockUsers = (count = 20) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i.toString(),
      name: `User ${i}`,
      email: `user${i}@example.com`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i}.jpg`,
      status: i % 5 === 0 ? 'inactive' : 'active',
      role: i % 3 === 0 ? 'admin' : 'student',
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100)
    });
  }
  return users;
};

export const generateMockTestResults = (users, count = 15) => {
  const testResults = [];
  for (let i = 1; i <= count; i++) {
    const userId = Math.floor(Math.random() * users.length) + 1;
    const user = users.find(u => u.id === userId.toString());
    const details = [];
    const wordCount = Math.floor(Math.random() * 5) + 3;
    
    for (let j = 0; j < wordCount; j++) {
      details.push({
        word: ['Sustainability', 'Entrepreneurship', 'Communication', 'Innovation', 'Collaboration'][j % 5],
        score: Math.floor(Math.random() * 30) + 50,
        feedback: ['Good pronunciation', 'Needs improvement', 'Excellent', 'Practice more'][j % 4]
      });
    }
    
    testResults.push({
      id: i.toString(),
      userId: userId.toString(),
      userName: user?.name || `User ${userId}`,
      testDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      overallScore: Math.floor(Math.random() * 30) + 50,
      pronunciation: Math.floor(Math.random() * 30) + 50,
      fluency: Math.floor(Math.random() * 30) + 50,
      accuracy: Math.floor(Math.random() * 30) + 50,
      feedback: ['Good fluency, needs work on vowel sounds', 'Excellent pronunciation', 'Needs more practice'][i % 3],
      details
    });
  }
  return testResults;
};

export const generateMockLessons = (count = 10) => {
  const lessons = [];
  for (let i = 1; i <= count; i++) {
    lessons.push({
      id: i.toString(),
      title: ['Business Meetings', 'Daily Conversations', 'Travel Phrases', 'Job Interviews'][i % 4],
      level: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
      description: `This is a sample description for lesson ${i}`,
      created: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      modified: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: i % 5 !== 0,
      content: {
        vocabulary: [
          { id: '1', word: 'Word 1', definition: 'Definition 1' },
          { id: '2', word: 'Word 2', definition: 'Definition 2' }
        ],
        dialogs: [
          { 
            id: '1', 
            speaker1: 'Speaker A', 
            text1: 'Hello, how are you?', 
            speaker2: 'Speaker B', 
            text2: 'I am fine, thank you!' 
          }
        ],
        paragraphs: [
          { id: '1', text: 'This is a sample paragraph for the lesson.' }
        ],
        images: [
          { id: '1', url: 'https://example.com/image.jpg', caption: 'Sample Image' }
        ]
      }
    });
  }
  return lessons;
};

export const generateMockFeedbacks = (users, count = 8) => {
  const feedbacks = [];
  for (let i = 1; i <= count; i++) {
    const userId = Math.floor(Math.random() * users.length) + 1;
    const user = users.find(u => u.id === userId.toString());
    
    feedbacks.push({
      id: i.toString(),
      userId: userId.toString(),
      userName: user?.name || `User ${userId}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      type: ['bug', 'feature_request', 'general_feedback'][i % 3],
      message: `This is a sample feedback message ${i}`,
      status: i % 2 === 0 ? 'open' : 'closed',
      priority: ['high', 'medium', 'low'][i % 3]
    });
  }
  return feedbacks;
};