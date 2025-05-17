import React from 'react';
import { Row, Col, Card, Statistic, Divider } from 'antd';
import { Chart } from 'react-google-charts';
import {
  TeamOutlined,
  BookOutlined,
  MessageOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const Dashboard = ({ users, lessons, feedbacks }) => {
  const userGrowthData = [
    ['Month', 'New Users'],
    ['Jan', 120], ['Feb', 180], ['Mar', 210], 
    ['Apr', 250], ['May', 320], ['Jun', 400]
  ];

  const testPerformanceData = [
    ['Score Range', 'Number of Students'],
    ['0-50', 15], ['51-70', 45], ['71-85', 80], ['86-100', 60]
  ];

  const lessonPopularityData = [
    ['Lesson', 'Completions'],
    ['Daily Conversations', 320],
    ['Business English', 280],
    ['Travel Phrases', 180],
    ['Job Interviews', 250]
  ];

  return (
    <div className="dashboard-content">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={users?.length}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Active Lessons"
              value={lessons?.filter(l => l.active).length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Open Feedback"
              value={feedbacks?.filter(f => f.status === 'open').length}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="User Growth">
            <Chart
              chartType="LineChart"
              width="100%"
              height="300px"
              data={userGrowthData}
              options={{
                title: 'New Users by Month',
                curveType: 'function',
                legend: { position: 'bottom' },
                hAxis: { title: 'Month' },
                vAxis: { title: 'New Users' },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Test Performance Distribution">
            <Chart
              chartType="Histogram"
              width="100%"
              height="300px"
              data={testPerformanceData}
              options={{
                title: 'Students by Score Range',
                legend: { position: 'none' },
                hAxis: { title: 'Score Range' },
                vAxis: { title: 'Number of Students' },
              }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Lesson Popularity">
            <Chart
              chartType="BarChart"
              width="100%"
              height="300px"
              data={lessonPopularityData}
              options={{
                title: 'Lesson Completions',
                legend: { position: 'none' },
                hAxis: { title: 'Completions' },
                vAxis: { title: 'Lesson' },
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;