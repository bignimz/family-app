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
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onTimeout]);

  return <div className="flash-message">{message}</div>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [navigateToFamilyTree, setNavigateToFamilyTree] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in (by verifying the token)
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8000/auth/jwt/verify/", {
          method: "POST", // Use POST method for token verification
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers if required
          },
          body: JSON.stringify({
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEwNDI5NTI5LCJpYXQiOjE3MTA0MjIzMjksImp0aSI6IjAyZjBlMGM4MzI4ZTQzOWU5ZmNkZmI5MzAzY2Y2MDAzIiwidXNlcl9pZCI6MX0.tn-74kUQD0gex5CPhn5l3C4N_J_idtOYnD6HYgzzesM", // Include the JWT token to verify
          }),
        })
          .then((response) => {
            if (response.ok) {
              // Token is valid
              console.log("Token is valid");
            } else {
              // Token is not valid
              console.error("Token is not valid");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    verifyToken();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        redirect: "manual",
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token); // Store the access token in local storage
        setIsLoggedIn(true);
        setSuccessMessage("Login successful");
        setNavigateToFamilyTree(true);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setSuccessMessage("Login failed");
    }
  };

  const handleFlashMessageTimeout = () => {
    setSuccessMessage("");
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="header-title">Welcome to Family Tree App</h1>
        </header>
        <main>
          {successMessage && (
            <FlashMessage
              message={successMessage}
              duration={3000}
              onTimeout={handleFlashMessageTimeout}
            />
          )}
          {navigateToFamilyTree && <Navigate to="/family-tree" />}
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/family-tree"
              element={
                isLoggedIn ? <FamilyTree /> : <Navigate to="/" replace={true} />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
