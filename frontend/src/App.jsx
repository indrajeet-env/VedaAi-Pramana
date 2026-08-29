import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import AssessmentDetail from "./pages/AssessmentDetail";
import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route element={<Layout />}>
        <Route path="/upload" element={<Upload />} />
        <Route path="/assessments/:id" element={<AssessmentDetail />} />
        {/* Redirect unknown routes in Layout to /upload for now */}
        <Route path="/home" element={<Navigate to="/upload" replace />} />
        <Route path="/classroom" element={<Navigate to="/upload" replace />} />
        <Route path="/assignments" element={<Navigate to="/upload" replace />} />
        <Route path="/library" element={<Navigate to="/upload" replace />} />
      </Route>

    </Routes>
  );
}

export default App;