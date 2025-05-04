import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Card, Container } from "react-bootstrap";

const Login = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="mb-4 text-center">🔐 Login to Your Account</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
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

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <span>New user? </span>
          <button
            className="btn btn-link p-0"
            onClick={onShowRegister}
          >
            Register
          </button>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
