import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

function InstructionsPage() {
    return (
        <Container className="mt-4" style={{maxWidth: '800px'}}>
            <div className="text-center mb-4">
                <h1 className="fw-bold">RACE THE RAILS</h1>
                <p className="text-muted fs-5">Navigate the underground network, beat the clock, collect coins.</p>
                <Button as={Link} to="/login" variant="dark" size="lg" className="mt-2">
                    Login to Play
                </Button>
            </div>
            <Row className="g-3 mb-4">
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <h5>Setup</h5>
                            <p className="text-muted mb-0">Study the full network map. All stations, lines and connections are shown before the challenge begins.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <h5>Planning</h5>
                            <p className="text-muted mb-0">You have <strong>90 seconds</strong> to build a route from your assigned start to destination. Lines are hidden, only station names and a segment list to guide you.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <h5>Execution</h5>
                            <p className="text-muted mb-0">Your route is validated and each segment plays out one by one. A random event hits at every stop, good or bad.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <h5>Result</h5>
                            <p className="text-muted mb-0">Your final score is the coins you have left. Climb the ranking by beating your own best score.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <h5 className="mb-3">Route Rules</h5>
                    <ul className="text-muted mb-0">
                        <li>Your route must start and end at the assigned stations.</li>
                        <li>Every segment must follow a real metro line connection.</li>
                        <li>You can only change lines at <strong>interchange stations</strong>.</li>
                        <li>An invalid or incomplete route means a score of <strong>0 coins</strong>.</li>
                    </ul>
                </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <h5 className="mb-1">Coins</h5>
                    <p className="text-muted mb-0">Every game starts with <strong>20 coins</strong>. Events along the way can add or subtract anywhere from <Badge bg="success">+4</Badge> to <Badge bg="danger">-4</Badge>. Minimum score is zero.</p>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default InstructionsPage;




