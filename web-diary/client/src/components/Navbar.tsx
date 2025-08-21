import { Navbar, Nav, NavDropdown, Button, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CiLight, CiDark } from "react-icons/ci";
import { useTheme } from "../contexts/theme.context";
import { useAuth } from "../contexts/auth.context";
import { BarLoader } from "react-spinners";

export default () => {
  const { darkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, authLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar
      expand="lg"
      className={darkMode ? "bg-dark navbar-dark" : "bg-light navbar-light"}
    >
      <div className="container-fluid px-5">
        <Navbar.Brand href="/">Web-Diary</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex flex-row w-100">
            <div className="me-auto d-flex">
              <Nav className="d-flex">
                <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                <Nav.Link onClick={() => navigate("/diaries")}>
                  Diaries
                </Nav.Link>
              </Nav>
            </div>
            <div className="d-flex">
              <Nav>
                <div
                  onClick={toggleTheme}
                  className="toggle-theme nav-button"
                  title={`Switch to ${darkMode ? "Light" : "Dark"} mode`}
                >
                  {darkMode ? <CiLight color="white" /> : <CiDark />}
                </div>
                {!authLoading ? (
                  isAuthenticated ? (
                    <NavDropdown
                      title={isAuthenticated ? user?.username : "ME"}
                      id="basic-nav-dropdown"
                      className=""
                      style={{ width: "10rem" }}
                    >
                      <NavDropdown.Item href="/me">
                        Your Profile
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={logout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <ButtonGroup>
                      <Button variant={darkMode ? "dark" : "light"}>
                        <Link className="text-decoration-none" to="/login">
                          Login
                        </Link>
                      </Button>
                      <Button variant={darkMode ? "dark" : "light"}>
                        <Link className="text-decoration-none" to="/signup">
                          Sign Up
                        </Link>
                      </Button>
                    </ButtonGroup>
                  )
                ) : (
                  <div className="mt-3">
                    <BarLoader width={170} color={darkMode ? "white" : "black"} />
                  </div>
                )}
              </Nav>
            </div>
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};
