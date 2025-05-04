import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Card, Container } from "react-bootstrap";

const Register = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });
      alert("Registration successful! You can now log in.");
      onBackToLogin(); // Go back to login
    } catch (err) {
      alert("Registration failed. Try a different email.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="mb-4 text-center">📝 Register</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100" variant="success">
            Register
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <span>Already have an account? </span>
          <button className="btn btn-link p-0" onClick={onBackToLogin}>
            Login
          </button>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
