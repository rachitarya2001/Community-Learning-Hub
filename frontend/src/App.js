import React, { useState, useEffect } from "react";
import FeedList from "./components/FeedList";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0);
  const [feeds, setFeeds] = useState([]);

  const fetchFeeds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feeds", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFeeds(res.data);
    } catch (err) {
      console.error("Error fetching feeds", err);
    }
  };

  // 🔁 Runs once on load
  useEffect(() => {
    const fetchRedditFeeds = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/feeds/fetch-reddit"
        );
        console.log("Reddit auto-fetch result:", res.data);
        if (res.data.added > 0) {
          toast.success(`🎉 ${res.data.added} new Reddit feeds added`);
        }
      } catch (err) {
        console.error("Auto-fetch Reddit failed", err);
      }
    };

    fetchRedditFeeds(); // immediate fetch on load

    const interval = setInterval(fetchRedditFeeds, 5 * 60 * 1000); // fetch every 5 mins

    return () => clearInterval(interval); // clear on unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowDashboard(false);
    setShowAdminPanel(false);
  };

  const handleLogin = () => {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    setIsLoggedIn(true);
    setIsAdmin(payload?.role === "admin");

    if (payload?.role === "admin") {
      setShowAdminPanel(true);
    } else {
      setShowDashboard(true);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" />
      {isLoggedIn ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={() => {
                setShowDashboard(false);
                setShowAdminPanel(false);
              }}
              className="btn btn-secondary me-2"
            >
              Feeds
            </button>
            {!showDashboard && !showAdminPanel && (
              <button
                onClick={() => {
                  if (isAdmin) {
                    setShowAdminPanel(true);
                  } else {
                    setShowDashboard(true);
                  }
                }}
                className={`btn ${isAdmin ? "btn-warning" : "btn-info"} me-2`}
              >
                Dashboard
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  setShowAdminPanel(true);
                  setShowDashboard(false);
                }}
                className="btn btn-warning me-2"
              >
                Dashboard
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>

          {/* 🎯 Render Correct View */}
          {showAdminPanel ? (
            <AdminDashboard />
          ) : showDashboard ? (
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Dashboard key={dashboardKey} />
            )
          ) : (
            <FeedList
              feeds={feeds}
              refreshFeeds={() => {
                setDashboardKey((prev) => prev + 1);
                fetchFeeds();
              }}
            />
          )}
        </>
      ) : showRegister ? (
        <>
          <Register onBackToLogin={() => setShowRegister(false)} />

          <p>
            Already have an account?{" "}
            <button
              onClick={() => setShowRegister(false)}
              className="btn btn-link"
            >
              Login
            </button>
          </p>
        </>
      ) : (
        <>
          {/* 🔑 This line is now key */}
          <Login
            onLogin={handleLogin}
            onShowRegister={() => setShowRegister(true)}
          />
        </>
      )}
    </div>
  );
};

export default App;
