import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EnglishPracticeLanding from './pages/Landing';
import SpeakingTestPage from './pages/SpeakingTestPage';
import RoadmapPage from './pages/RoadmapPage';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminDashboard/AdminLayout';
// import About   from './pages/About';    // example extra page
// import Contact from './pages/Contact';  // example extra page
// import '../App.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / → Landing */}
        <Route path="/" element={<EnglishPracticeLanding />} />
        <Route path="/trial" element={<SpeakingTestPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/user-dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminLayout />} />

        {/* other routes */}
        {/* <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}

        {/* catch-all for 404s (optional) */}
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;