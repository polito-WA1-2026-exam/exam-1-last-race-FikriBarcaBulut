import {Button, Card} from 'react-bootstrap';

function ResultPhase({executionData, onPlayAgain}) {
    const { finalScore, valid, steps } =executionData;

    return (
        <div className="d-flex justify-content-center mt-5">
            <Card className="border-0 shadow-sm text-center" style={{ width: '400px' }}>
                <Card.Body className="py-5">
                    <h4 className="mb-1">{valid ? 'Journey Complete' : 'Invalid Route'}</h4>
                    <p className="text-muted mb-4">
                        {valid
                            ? `You completed ${steps.length} segment${steps.length !== 1 ? 's' : ''}.`
                            : 'Your route was invalid or incomplete.'}
                    </p>
                    <div className="mb-4">
                        <p className="text-muted small mb-1">Final Score</p>
                        <span className="display-4 fw-bold">{finalScore}</span>
                        <span className="text-muted ms-2">coins</span>
                    </div>
                    <Button variant="dark" size="lg" onClick={onPlayAgain}>Play Again</Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ResultPhase;



