import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Spinner } from "react-bootstrap";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reportedFeeds, setReportedFeeds] = useState([]);
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchAdminData = async () => {
    try {
      const [userRes, reportedRes, savedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/reported-feeds", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/saved-feeds", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(userRes.data);
      setReportedFeeds(reportedRes.data);
      setSavedFeeds(savedRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setLoading(false);
    }
  };

  const deleteFeed = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feed?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/feed/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Feed deleted!");
      fetchAdminData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-5" />;

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">🛡 Admin Dashboard</h2>

      <h4>👤 Registered Users</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Credits</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.credits}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="mt-5">🚩 Reported Feeds</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Preview</th>
            <th>Reported By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reportedFeeds.map((feed) => (
            <tr key={feed._id}>
              <td>{feed.title}</td>
              <td>{feed.preview}</td>
              <td>
                {feed.reports.map((r, idx) => (
                  <div key={idx}>
                    {r.userName} ({r.userEmail}) — {r.reason}
                  </div>
                ))}
              </td>
              <td>
                <Button variant="danger" onClick={() => deleteFeed(feed._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="mt-5">🔖 Saved Feeds</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Saved By</th>
          </tr>
        </thead>
        <tbody>
          {savedFeeds.map((feed) => (
            <tr key={feed._id}>
              <td>{feed.title}</td>
              <td>
                {feed.savedBy.map((u) => (
                  <div key={u._id}>
                    {u.name} ({u.email})
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
