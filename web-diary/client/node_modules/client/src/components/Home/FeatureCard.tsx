import Card from "react-bootstrap/Card";
import { useTheme } from "../../contexts/theme.context";

function FeatureCard(props: {
  src: string
  title: string
  text: string  
}) {
  const { darkMode } = useTheme()
  return (
    <Card className={`feature-card ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Card.Img variant="top" src={props.src} 
      // className={`${darkMode && 'bg-light'}`} 
      />
      <Card.Body className="text-center">
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.text}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default FeatureCard;
