import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import QuestionLogic from "./components/QuestionLogic";
import Account from "./components/Account/Account";
import Protected from "./components/Protected";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-bg text-text font-sans">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="bg-surface rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<QuestionLogic />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/protected"
                  element={
                    <ProtectedRoute>
                      <Protected />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </AuthProvider>
      </div>
    </Router>
  );
};

export default App;
