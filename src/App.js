// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnglishPracticeLanding from "./pages/Landing";
import SpeakingTestPage from "./pages/SpeakingTestPage";
import RoadmapPage from "./pages/RoadmapPage";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EnglishPracticeLanding />} />

        {/* protected user routes */}s
        <Route element={<PrivateRoute />}>
          <Route path="/trial" element={<SpeakingTestPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/user-dashboard" element={<Dashboard />} />
        </Route>

        {/* protected admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminLayout />} />
        </Route>

        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
