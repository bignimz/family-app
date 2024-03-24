import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import FamilyTree from "./components/FamilyTree";

function FlashMessage({ message, duration = 3000, onTimeout }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onTimeout();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onTimeout]);

  return visible ? <div className="flash-message">{message}</div> : null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data); // Log the response data
        const token = data.tokens.access;

        if (!token) {
          throw new Error("Token not found in response data");
        }

        // Log the token value before storing it
        console.log("Token:", token);

        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setSuccessMessage("Login successful");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Login failed");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSuccessMessage("");
    setError("");
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="header-title">Welcome to Family Tree App</h1>
          {isLoggedIn && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </header>
        <main>
          {successMessage && (
            <FlashMessage
              message={successMessage}
              duration={3000}
              onTimeout={() => setSuccessMessage("")}
            />
          )}
          {error && (
            <FlashMessage
              message={error}
              duration={3000}
              onTimeout={() => setError("")}
            />
          )}
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/family-tree" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/family-tree"
              element={isLoggedIn ? <FamilyTree /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
