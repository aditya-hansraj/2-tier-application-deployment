import { Container, Row, Col, Button, Card } from 'react-bootstrap';    
// Use public/assets/hero.png as a static asset
const hero_img = '/assets/hero.png';
import { TfiWrite } from "react-icons/tfi";
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
     <section className={`hero-section py-5`}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="text-center text-md-start">
              <h1 className="display-4 mb-4">Capture Your Moments, One Entry at a Time</h1>
              <p className="lead mb-4">
              Transform your daily experiences into treasured memories with our intuitive diary app. Reflect on your journey, track your growth, and savor every moment, all while keeping your thoughts completely private and secure.
              </p>
              <Button variant="primary" size="lg" className='btn'>
                <Link className='text-decoration-none text-light' to='/addentry'><span className='px-4'>Write Your Day Now</span><TfiWrite /></Link>
              </Button>
            </div>
          </Col>
          <Col md={6} className='d-none d-md-block'>
            <Card className="border-0">
              <Card.Img
                variant="top"
                src={hero_img}
                className={`img-fluid rounded-3`}
                alt="Hero Image"
              />
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
