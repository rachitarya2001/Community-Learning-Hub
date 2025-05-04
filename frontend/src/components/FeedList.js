import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const FeedList = ({ onDashboardUpdate }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchFeeds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feeds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeeds(res.data);
    } catch (err) {
      console.error("Error fetching feeds", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleSave = async (feedId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/feeds/save",
        { feedId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      fetchFeeds();
      if (onDashboardUpdate) onDashboardUpdate();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.success(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred while saving.");
        console.error("Save error:", err);
      }
    }
  };

  const handleShare = async (feedId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/feeds/share",
        { feedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message); // "Feed shared!"
      fetchFeeds(); // Refresh after sharing
      if (onDashboardUpdate) onDashboardUpdate();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.info(err.response.data.message); // "Already shared"
      } else {
        toast.error("Failed to share feed.");
        console.error("Share error:", err);
      }
    }
  };

  const handleReport = async (feedId) => {
    const reason = prompt("Why are you reporting this?");
    if (reason) {
      try {
        await axios.post(
          "http://localhost:5000/api/feeds/report",
          { feedId, reason },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Reported!");
        fetchFeeds();
        if (onDashboardUpdate) onDashboardUpdate();
      } catch (err) {
        console.error("Report failed", err);
        toast.error("Failed to report feed.");
      }
    }
  };

  const fetchTwitterFeeds = async () => {
    try {
      await axios.get("http://localhost:5000/api/feeds/fetch-twitter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Twitter feeds fetched");
      fetchFeeds();
    } catch (err) {
      if (err.response?.status === 429) {
        toast.warning(err.response.data.message);
      } else {
        toast.error("Failed to fetch Twitter feeds");
      }
    }
  };

  const fetchRedditFeeds = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/feeds/fetch-reddit",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.added > 0) {
        toast.success(`✅ ${res.data.added} new Reddit posts added!`);
      } else {
        toast.info("ℹ️ No new Reddit posts were found.");
      }

      fetchFeeds(); // refresh the feed list after fetching
    } catch (err) {
      toast.error("❌ Failed to fetch Reddit feeds.");
      console.error("Fetch Reddit error:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🌐 Latest Feeds</h2>

      <div className="mb-4 text-center">
        <Button
          variant="outline-primary"
          className="me-2"
          onClick={fetchTwitterFeeds}
        >
          Fetch Twitter Feeds
        </Button>
        <Button variant="outline-secondary" onClick={fetchRedditFeeds}>
          Fetch Reddit Feeds
        </Button>
      </div>

      <Row>
        {feeds.map((feed) => (
          <Col key={feed._id} md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted text-capitalize">
                  {feed.source}
                </Card.Subtitle>
                <Card.Title>{feed.title}</Card.Title>
                <Card.Text>{feed.preview}...</Card.Text>
                <Button
                  variant="primary"
                  href={feed.url}
                  target="_blank"
                  className="me-2"
                >
                  Read More
                </Button>
                <Button
                  variant="outline-success"
                  className="me-2"
                  onClick={() => handleSave(feed._id)}
                >
                  Save
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleReport(feed._id)}
                >
                  Report
                </Button>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => handleShare(feed._id)}
                >
                  Share
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeedList;
