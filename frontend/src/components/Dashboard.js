import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Table } from "react-bootstrap";

const Dashboard = () => {
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [reportedFeeds, setReportedFeeds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [creditPoints, setCreditPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      const [feedRes, creditRes] = await Promise.all([
        axios.get("http://localhost:5000/api/feeds", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/credits/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userId = creditRes.data.userId;
      const allFeeds = feedRes.data;

      const saved = allFeeds.filter((f) => f.savedBy.includes(userId));
      const reported = allFeeds.filter((f) =>
        f.reports.some((r) => r.userId === userId)
      );

      setSavedFeeds(saved);
      setReportedFeeds(reported);
      setTransactions(creditRes.data.transactions);
      setCreditPoints(creditRes.data.totalPoints);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">📊 User Dashboard</h2>

      <h4>Total Credit Points: {creditPoints}</h4>

      {/* Transactions Table */}
      <h5 className="mt-4">💰 Transaction History</h5>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Points</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td>{tx.type}</td>
                <td>{tx.points}</td>
                <td>{tx.purpose}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Saved Feeds */}
      <h5 className="mt-4">🔖 Saved Feeds</h5>
      <Row>
        {savedFeeds.map((feed) => (
          <Col key={feed._id} md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted text-capitalize">
                  {feed.source}
                </Card.Subtitle>
                <Card.Title>{feed.title}</Card.Title>
                <Card.Text>{feed.preview}...</Card.Text>
                <a
                  className="btn btn-primary"
                  href={feed.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read More
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Reported Feeds */}
      <h5 className="mt-5">🚩 Reported Feeds</h5>
      <Row>
        {reportedFeeds.map((feed) => (
          <Col key={feed._id} md={4} className="mb-4">
            <Card className="h-100 border-danger">
              <Card.Body>
                <Card.Subtitle className="mb-2 text-danger text-capitalize">
                  {feed.source}
                </Card.Subtitle>
                <Card.Title>{feed.title}</Card.Title>
                <Card.Text>{feed.preview}...</Card.Text>
                <a
                  className="btn btn-outline-danger"
                  href={feed.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Reported Content
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
