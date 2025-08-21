import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/auth.context";
import { useTheme } from "../contexts/theme.context";
import pfp from "../../public/assets/user.png"
import { useEntryContext } from "../contexts/entry.context";
import moment from "moment";
import { Link } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { entries } = useEntryContext();
  const activities = user?.activities;

  return (
    <Container className={`my-4 p-4 ${darkMode ? "bg-secondary text-light" : "bg-light text-dark"} rounded`}>
      <Row>
        <Col md={4}>
          <Card className={`${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}>
            <Card.Img variant="top" src={pfp} alt="Profile" style={{padding: '2.5em'}} />
            <Card.Body>
              <Card.Title>{user?.username}</Card.Title>
              <Card.Text>{user?.email}</Card.Text>
              <Button variant={darkMode ? "outline-light" : "outline-dark"}>Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className={`${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}>
            <Card.Body>
              <h5 className="mb-4">User Statistics</h5>
              <p>Total Entries: {entries.length}</p>
              <div className="recent-activities border rounded p-3">
                <h5>Recent Activities: </h5>
                <p>
                  <span>
                    {activities ? activities[0].name + moment(activities[0].date).calendar() : ''}
                  </span>
                </p>
                <Link className="text-decoration-none" to='/me/activities' >more...</Link>
              </div>
              <h5 className="mt-4 mb-3">Settings</h5>
              <Form.Check 
                type="switch" 
                id="custom-switch" 
                label="Dark Mode" 
                checked={darkMode} 
                onChange={toggleTheme}  
              />
              <Button variant={darkMode ? "outline-light" : "outline-dark"} className="mt-3">
                <Link className="text-decoration-none" to='change-password'>Change Password</Link>
              </Button>
              <Button variant="danger" className="mt-3 mx-2" onClick={logout}>Logout</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
