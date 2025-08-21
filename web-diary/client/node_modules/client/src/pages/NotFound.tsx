import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container className="text-center my-5 py-5">
      <Row>
        <Col>
          <div className="display-1 text-danger">404</div>
          <h2 className="my-4">Page Not Found</h2>
          <p className="lead">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link to="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
