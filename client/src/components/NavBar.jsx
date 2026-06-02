import { Link, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

function NavBar({ user, onLogout }) {
    const location = useLocation();

    return (
        <Navbar bg="dark" variant="dark" sticky="top">
            <Container fluid="lg">
                <Navbar.Brand as={Link} to={user ? '/game' : '/'}>RACE THE RAILS</Navbar.Brand>
                <Nav className="ms-auto align-items-center gap-2">
                    {user ? (
                        <>
                            <Nav.Link
                                as={Link}
                                to="/ranking"
                                className={location.pathname === '/ranking' ? 'text-white fw-bold' : 'text-secondary'}
                            >
                                Ranking
                            </Nav.Link>
                            <Navbar.Text className="text-secondary">|</Navbar.Text>
                            <Navbar.Text className="text-white">{user.username}</Navbar.Text>
                            <Button variant="outline-light" size="sm" onClick={onLogout}>Logout</Button>
                        </>
                    ) : (
                        <Nav.Link as={Link} to="/login" className="text-white border border-secondary rounded px-3">
                            Login
                        </Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}
export default NavBar;







