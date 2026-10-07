import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UploadResume from "./pages/UploadResume";
import Analysis from "./pages/Analysis";
import ResumeHistory from "./pages/ResumeHistory";
import JobMatch from "./pages/JobMatch";
import JobMatchHistory from "./pages/JobMatchHistory";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ResumeHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-match"
          element={
            <ProtectedRoute>
              <JobMatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-match-history"
          element={
            <ProtectedRoute>
              <JobMatchHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
