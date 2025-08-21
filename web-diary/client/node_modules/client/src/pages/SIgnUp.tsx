import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/theme.context";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { useAuth } from "../contexts/auth.context";
import { BeatLoader } from "react-spinners";

const Signup: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { darkMode } = useTheme();
  const {
    register,
    registerInfo,
    updateRegisterInfo,
    isRegisterLoading,
    registerError,
  } = useAuth();

  const handleChange = (event: any) => {
    updateRegisterInfo({
      ...registerInfo,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        style={{ width: "100%", maxWidth: "400px" }}
        className={darkMode ? "bg-dark" : "bg-light"}
      >
        <Card.Body>
          <Card.Title
            className={`text-center mb-4 ${darkMode && "text-light"}`}
          >
            Sign Up
          </Card.Title>
          {registerError && <Alert variant="danger">{registerError}</Alert>}
          <Form onSubmit={register}>
            <div className="d-flex flex-column justify-content-evenly">
              <FloatingLabel
                controlId="floatingInput"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={registerInfo.username}
                  name="username"
                  onChange={handleChange}
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label="Email"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={registerInfo.email}
                  name="email"
                  onChange={handleChange}
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={registerInfo.password}
                  name="password"
                  onChange={handleChange}
                />
                <Button
                  size="lg"
                  variant="light"
                  className="position-absolute top-50 end-0 translate-middle"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  disabled={isRegisterLoading}
                >
                  {passwordVisible ? <BiHide /> : <BiShowAlt />}
                </Button>
              </FloatingLabel>
            </div>
            <Button variant="primary" type="submit" className="mt-3 w-100">
            {isRegisterLoading? <BeatLoader color='#d9d9d9' /> : "Sign Up"}
            </Button>
          </Form>
          <Link
            className="d-block w-100 text-center text-decoration-none mt-4"
            to="/login"
          >
            Login
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Signup;
