import { Container } from "react-bootstrap";
import data from "../../utils/data.json";
import FeatureCard from "./FeatureCard";

const features = data.features;

export default function Features() {
  return (
    <Container>
      <div className="row">
        {features.map(({ title, description, image }, index) => (
          <div className="col-md-3 col-sm-5 mb-4" key={index}>
            <FeatureCard title={title} text={description} src={image} />
          </div>
        ))}
      </div>
    </Container>
  );
}
