import { Container } from "react-bootstrap";
import { HashLoader as Loader } from "react-spinners";
import { useTheme } from "../../contexts/theme.context";

export default function HashLoader() {
  const { darkMode } = useTheme()
  return (
    <Container className="d-flex justify-content-center align-items-center h-90 loader-container">
      <Loader color={darkMode ? "white" : "black"} />
    </Container>
  );
}
