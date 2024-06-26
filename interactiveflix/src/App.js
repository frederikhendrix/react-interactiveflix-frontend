import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import AdminPage from "./components/AdminPage";
import SignUpPage from "./components/SignUpPage";
import VideoPage from "./components/VideoPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={"Loading..."}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute roles={["User", "Admin"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/video/:id/:videoName"
              element={
                <PrivateRoute roles={["User", "Admin"]}>
                  <VideoPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute roles={["User", "Admin"]}>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
