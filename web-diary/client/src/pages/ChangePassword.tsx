import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/auth.context";
import { useTheme } from "../contexts/theme.context";
import { BeatLoader } from "react-spinners";

const ChangePassword: React.FC = () => {
  const { darkMode } = useTheme();
  const { updatePassword, isLoginLoading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully.");
      setError("");
    } catch (err) {
      setError("Failed to change password.");
      setSuccess("");
    }
  };

  return (
    <Container className={`my-4 p-4 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"} rounded`}>
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="mb-4">Change Password</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant={darkMode ? "light" : "dark"} type="submit">
              {isLoginLoading ? <BeatLoader color="#d9d9d9" /> : "Change Password"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
