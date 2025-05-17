import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Card, 
  Row, 
  Col, 
  Avatar, 
  List, 
  Steps, 
  Divider, 
  Tag,
  Statistic,
  Carousel,
  Modal,
  Form,
  Input,
  Checkbox
} from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  MessageOutlined,
  CalendarOutlined,
  BookOutlined,
  CheckCircleOutlined,
  StarFilled,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContext }            from 'react';
import { AuthContext }           from '../context/AuthContext';
const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Step } = Steps;
const { Item } = Form;

const features = [
  {
    icon: <TeamOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    title: 'Giáo viên được chứng nhận',
    description: 'Học từ những giáo viên tiếng Anh hàng đầu của chúng tôi.'
  },
  {
    icon: <MessageOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    title: 'Cộng đồng thực hành',
    description: 'Tham gia các buổi học nhóm trực tiếp với sinh viên khắp thế giới.'
  },
  {
    icon: <CalendarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    title: 'Lịch học linh hoạt',
    description: 'Truy cập 24/7 các buổi học phù hợp với lịch trình của bạn.'
  },
  {
    icon: <BookOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    title: 'Giáo trình nhà trường',
    description: 'Phù hợp với chương trình học của trường để học tập liền mạch.'
  }
];

const testimonials = [
  {
    name: 'Nguyễn Thị Hương',
    role: 'Học viên nâng cao',
    content: 'Nền tảng này giúp tôi từ trình độ trung cấp lên nâng cao chỉ trong 6 tháng. Giáo viên thật tuyệt vời!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Trần Văn Nam',
    role: 'Sinh viên kinh doanh',
    content: 'Các buổi học tiếng Anh thương mại bổ sung hoàn hảo cho việc học của tôi. Kỹ năng thuyết trình được cải thiện đáng kể.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Lê Thị Mai',
    role: 'Chuẩn bị đại học',
    content: 'Nhờ chương trình này, tôi đã vượt qua kỳ thi IELTS với điểm số cao và vào được trường đại học mơ ước.',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
  }
];

const pricingPlans = [
  {
    name: 'Cơ bản',
    price: 199000,
    features: [
      '5 buổi học trực tiếp/tháng',
      'Truy cập cộng đồng',
      'Theo dõi tiến độ cơ bản',
      'Hỗ trợ qua email'
    ],
    recommended: false
  },
  {
    name: 'Nâng cao',
    price: 499000,
    features: [
      'Buổi học trực tiếp không giới hạn',
      'Nhận phản hồi ưu tiên',
      'Theo dõi tiến độ nâng cao',
      '1 buổi học riêng/tháng',
      'Hỗ trợ 24/7'
    ],
    recommended: true
  },
  {
    name: 'Gói trường học',
    price: 'Liên hệ',
    features: [
      'Giá ưu đãi',
      'Tích hợp giáo trình',
      'Bảng điều khiển giáo viên',
      'Bảng quản trị',
      'Hỗ trợ chuyên dụng'
    ],
    recommended: false
  }
];

const EnglishPracticeLanding = () => {
  const { signIn, signUp } = useContext(AuthContext);

  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const navigate = useNavigate();

  const showLoginModal = () => {
    setIsLoginVisible(true);
  };

  const showRegisterModal = () => {
    setIsRegisterVisible(true);
  };

  const handleCancel = () => {
    setIsLoginVisible(false);
    setIsRegisterVisible(false);
  };

  const onFinishLogin = async (values) => {
    try {
      const user = await signIn({
        username: values.username,
        password: values.password,
      });
      setIsLoginVisible(false);
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };
  const onFinishRegister = async (values) => {
    try {
      await signUp({
        username: values.username,
        email:    values.email,
        password: values.password,
        name:     values.fullname,
        phone:    values.phone
      });
      setIsRegisterVisible(false);
      navigate('/user-dashboard');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };
  
  return (
    <Layout className="layout">
      {/* Header with Animation */}
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff' }}>
        <div className="logo" style={{ float: 'left', marginRight: '24px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>Trường đại học kỹ thuật hậu cần - CAND</span>
        </div>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
          <Menu.Item key="1">Trang chủ</Menu.Item>
          <Menu.Item key="2">Tính năng</Menu.Item>
          <Menu.Item key="3">Cách hoạt động</Menu.Item>
          <Menu.Item key="4">Đánh giá</Menu.Item>
          {/* <Menu.Item key="5">Bảng giá</Menu.Item> */}
        </Menu>
        <div style={{ float: 'right' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button type="primary" onClick={showLoginModal} style={{ marginRight: '8px' }}>Đăng nhập</Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button onClick={showRegisterModal}>Đăng ký</Button>
          </motion.div>
        </div>
      </Header>

      {/* Hero Section with Your Image */}
      <Content style={{ padding: '0', marginTop: '64px' }}>
        <motion.div 
          className="hero-section" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://dhkthc.bocongan.gov.vn/TrangChu/data/pic/1722241943.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            padding: '100px 24px',
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            style={{ fontSize: '48px', marginBottom: '24px' }}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Luyện Tiếng Anh tại Trường đại học kỹ thuật hậu cần - CAND
          </motion.h1>
          <motion.p 
            style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto 40px' }}
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Tham gia nền tảng thực hành tiếng Anh của chúng tôi với phương pháp giảng dạy đã được chứng minh.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-block', marginRight: '16px' }}
            >
              <Button type="primary" size="large" onClick={() => navigate('/trial')}>Dùng thử miễn phí 7 ngày</Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-block' }}
            >
              <Button size="large" style={{ color: 'black', borderColor: '#fff' }}>Xem demo</Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Rest of your content sections... */}
        {/* (Keep all the other sections from the previous code, just update text to Vietnamese) */}

      </Content>

      {/* Login Modal */}
      <Modal
        title="Đăng nhập"
        visible={isLoginVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinishLogin}
          >
            <Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Item>
            <Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Item>
            <Item>
              <Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Item>
              <a style={{ float: 'right' }} href="">Quên mật khẩu?</a>
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" block>
                Đăng nhập
              </Button>
              Hoặc <a onClick={() => { setIsLoginVisible(false); showRegisterModal(); }}>đăng ký ngay!</a>
            </Item>
          </Form>
        </motion.div>
      </Modal>

      {/* Register Modal */}
      <Modal
        title="Đăng ký tài khoản"
        visible={isRegisterVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={800}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ 
            backgroundImage: 'url(https://dhkthc.bocongan.gov.vn/TrangChu/assets/img/bg_ft.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '24px',
            borderRadius: '8px'
          }}>
            <Form
              name="register_form"
              onFinish={onFinishRegister}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Item
                    label="Họ và tên"
                    name="fullname"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                  >
                    <Input />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}
                  >
                    <Input />
                  </Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input />
                  </Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item
                    label="Xác nhận mật khẩu"
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Item>
                </Col>
              </Row>
              <Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Đăng ký
                </Button>
                Đã có tài khoản? <a onClick={() => { setIsRegisterVisible(false); showLoginModal(); }}>Đăng nhập ngay!</a>
              </Item>
            </Form>
          </div>
        </motion.div>
      </Modal>

      {/* Footer */}
      <Footer style={{ background: '#001529', color: 'rgba(255, 255, 255, 0.65)' }}>
        {/* (Keep your existing footer, just update text to Vietnamese) */}
      </Footer>
    </Layout>
  );
};

export default EnglishPracticeLanding;