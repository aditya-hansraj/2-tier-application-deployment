import React, { useState } from "react";
import { Container, Tab, Row, Col, Nav, Card, Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/auth.context";
import { useTheme } from "../contexts/theme.context";

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <Container className={`my-4 p-4 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"} rounded`}>
      <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={(k) => setActiveTab(k!)}>
        <Row>
          <Col sm={12}>
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="profile">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="activities">Recent Activities</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="settings">Settings</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Card className={`${darkMode ? "bg-secondary text-light" : "bg-white text-dark"} mb-4`}>
                  <Card.Img variant="top" src="https://via.placeholder.com/150" alt="Profile" />
                  <Card.Body>
                    <Card.Title>{user?.username}</Card.Title>
                    <Card.Text>{user?.email}</Card.Text>
                    <Button variant={darkMode ? "outline-light" : "outline-dark"}>Edit Profile</Button>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="activities">
                <h5>Recent Activities</h5>
                <ul>
                  <li>Edited entry "Trip to the Mountains" - 2 days ago</li>
                  <li>Added new entry "Reflections on Life" - 5 days ago</li>
                </ul>
              </Tab.Pane>
              <Tab.Pane eventKey="settings">
                <h5>Settings</h5>
                <Form.Check
                  type="switch"
                  id="dark-mode-switch"
                  label="Dark Mode"
                  checked={darkMode}
                  onChange={toggleTheme}
                />
                <Button variant={darkMode ? "outline-light" : "outline-dark"} className="mt-3">Change Password</Button>
                <Button variant="danger" className="mt-3 mx-2">Logout</Button>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default UserProfile;
