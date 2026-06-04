import { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import NetworkMap from './NetworkMap.jsx';

function PlanningPhase({ gameData, onSubmit }) {
    const { startStation, destStation, segments, stations } = gameData;

    const [route, setRoute] = useState([]);
    const [timeLeft, setTimeLeft] = useState(90);
    const [submitted, setSubmitted] = useState(false);

    const routeRef = useRef([]);
    useEffect(() => {
        routeRef.current = route;
    }, [route]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if(t <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(timeLeft === 0 && !submitted) {
            setSubmitted(true);
            onSubmit(routeRef.current);
        }
    }, [timeLeft, submitted]);

    const lastStationId = route.length > 0 ? route[route.length - 1].to : null;

    const addSegment=(seg)=>{
        if(submitted) {
            return;
        }
        let from = seg.from.id;
        let to = seg.to.id;
        if(lastStationId ===null) {
            if(seg.to.id === startStation.id) {
                from = seg.to.id;
                to = seg.from.id;
            }
        } else {
            if(lastStationId === seg.to.id) {
                from = seg.to.id;
                to = seg.from.id;
            }
        }
        setRoute(r=>[...r, { from, to }]);
    };

    const removeLastSegment = () => {
        setRoute(r => r.slice(0, -1));
    };

    const handleSubmit = () => {
        if(submitted) {
            return;
        }
        setSubmitted(true);
        onSubmit(route);
    };

    const stationById = {};
    for(const s of stations) {
        stationById[s.id] = s;
    }

    const planningNetwork = { stations, lines: [], lineStations: [] };
    const timerColor = timeLeft <= 15 ? 'danger' : timeLeft <= 30 ? 'warning' : 'dark';

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded shadow-sm">
                <div className="d-flex gap-4">
                    <div>
                        <small className="text-muted d-block">From</small>
                        <strong>{startStation.name}</strong>
                    </div>
                    <div>
                        <small className="text-muted d-block">To</small>
                        <strong>{destStation.name}</strong>
                    </div>
                </div>
                <Badge bg={timerColor} className="fs-5 px-3 py-2">{timeLeft}s</Badge>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={removeLastSegment}
                        disabled={route.length === 0 || submitted}>Undo</Button>
                    <Button variant="dark" onClick={handleSubmit} disabled={submitted}>Submit Route</Button>
                </div>
            </div>
            <Row className="g-3">
                <Col lg={5}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-semibold">Stations</Card.Header>
                        <Card.Body>
                            <NetworkMap network={planningNetwork} showLines={false} />
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm mt-3">
                        <Card.Header className="bg-white fw-semibold">
                            Your Route <Badge bg="secondary" className="ms-1">{route.length}</Badge>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {route.length === 0 ? (
                                <p className="text-muted p-3 mb-0">No segments added yet.</p>
                            ) : (
                                <ListGroup variant="flush">
                                    {route.map((seg, idx) => (
                                        <ListGroup.Item key={idx} className="py-2">
                                            <small className="text-muted me-2">{idx + 1}.</small>
                                            {stationById[seg.from]?.name} → {stationById[seg.to]?.name}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={7}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-semibold">Segments</Card.Header>
                        <Card.Body className="p-0" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                            <ListGroup variant="flush">
                                {segments.map((seg, idx) => {
                                    const connects = lastStationId === null ||
                                        seg.from.id === lastStationId ||
                                        seg.to.id === lastStationId;
                                    return (
                                        <ListGroup.Item
                                            key={idx}
                                            className={`d-flex justify-content-between align-items-center py-2 ${!connects ? 'opacity-50' : ''}`}>
                                            <span>{seg.from.name} - {seg.to.name}</span>
                                            <Button
                                                size="sm"
                                                variant={connects ? 'outline-dark' : 'outline-secondary'}
                                                onClick={() => addSegment(seg)}
                                                disabled={!connects || submitted}>
                                                Add
                                            </Button>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PlanningPhase;