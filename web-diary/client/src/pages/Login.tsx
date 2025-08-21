import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiHide, BiShowAlt } from 'react-icons/bi';
import { useTheme } from "../contexts/theme.context";
import { useAuth } from '../contexts/auth.context';
import { BeatLoader } from 'react-spinners';

const Login: React.FC = () => { 
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, updateLoginInfo, loginInfo, isLoginLoading, loginError } = useAuth();

  const handleChange = (event: any) => {
    updateLoginInfo({...loginInfo,  [event.target.name]: event.target.value});
  }

  const { darkMode } = useTheme();

  const googleAuth = () => {
    window.open(
      `http://localhost:5000/auth/google/callback`,
      "_self"
    )
  }

  return (
    <Container
      className={`d-flex justify-content-center align-items-center min-vh-100`}
    >
      <Card
        style={{ width: '100%', maxWidth: '400px' }}
        className={darkMode ? "bg-dark" : "bg-light"}
      >
        <Card.Body>
          <Card.Title className={`text-center mb-4 ${darkMode && 'text-light'}`}>Login</Card.Title>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form onSubmit={login}>
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                name='username'
                value={loginInfo.username}
                onChange={handleChange}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                name='password'
                value={loginInfo.password}
                onChange={handleChange}
              />
              <Button
                size='lg'
                variant='light'
                className="position-absolute top-50 end-0 translate-middle"
                onClick={() => setPasswordVisible(!passwordVisible)}
                disabled={isLoginLoading}
              >
                {passwordVisible ? <BiHide /> : <BiShowAlt />}
              </Button>
            </FloatingLabel>
            <Button variant="primary" type="submit" className="mt-3 w-100">
            {isLoginLoading? <BeatLoader color='#d9d9d9' /> : "Login"}
            </Button>
          </Form>
          <Button onClick={googleAuth}>
              <span>Sign in with Google</span>
          </Button>
          <Link className="d-block w-100 text-center text-decoration-none mt-4" to="/signup">
            Sign Up
          </Link>
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
