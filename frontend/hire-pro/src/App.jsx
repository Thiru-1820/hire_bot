import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import LoginSignup from "./pages/LoginSignup";
import HomePage from "./pages/HomePage";
import InterviewDetail from "./pages/InterviewDetail";
import MCQPage from "./pages/MCQPage";
import CodingRoundPage from "./pages/CodingRoundPage";
import CollegeAdmin from "./pages/CollegeAdmin";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import GenerateMCQ from './sections/GenerateMCQ'
import InterviewChat from "./sections/InterViewChat";

// ProtectedRoute Component
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route
            path="/home"
            element={<ProtectedRoute element={<HomePage />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/interview/:id"
            element={<ProtectedRoute element={<InterviewDetail />} />}
          />
          <Route
            path="/mcq"
            element={<ProtectedRoute element={<MCQPage />} />}
          />
          <Route
            path="/coding-round"
            element={<ProtectedRoute element={<CodingRoundPage />} />}
          />
          <Route path="/college-admin" element={<CollegeAdmin />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/generate-mcq" element={<GenerateMCQ/>} />
           <Route path="/interview-chat" element={<InterviewChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;