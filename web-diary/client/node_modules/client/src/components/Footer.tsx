import { Container, Row, Col, Nav } from "react-bootstrap";
import { useTheme } from "../contexts/theme.context";

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`footer ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      } py-4`}
    >
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              We are committed to providing the best journaling experience.
              Our platform offers a range of features to help you capture and
              organize your thoughts securely.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              Email:{" "}
              <a href="mailto:hansrajaditya.me@gmail.com">
                hansrajaditya.me@gmail.com
              </a>
            </p>
            <p>Address: 1234 Street Name, City, State, 12345</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p className="mb-0 text-secondary">
              &copy; {new Date().getFullYear()} The Web Diary. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
