import {useState} from 'react';
import {Card, Button,Badge, Alert} from 'react-bootstrap';

function ExecutionPhase({executionData, onDone}) {
    const [currentStep, setCurrentStep] = useState(0);

    if(!executionData.valid) {
        return (
            <div className="text-center mt-5">
                <Alert variant="danger" className="d-inline-block">
                    <h5 className="mb-1">Invalid Route</h5>
                    <p className="mb-0">{executionData.reason}</p>
                </Alert>
                <div className="mt-3">
                    <p className="text-muted">Your score is <strong>0 coins</strong>.</p>
                    <Button variant="dark" onClick={onDone}>See Result</Button>
                </div>
            </div>
        );
    }

    const {steps} = executionData;
    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;

    const effectColor = step.event.effect > 0 ? 'success' : step.event.effect < 0 ? 'danger' : 'secondary';

    return (
        <div className="d-flex justify-content-center mt-4">
            <div style={{ maxWidth: '500px', width: '100%' }}>
                <div className="text-center mb-4">
                    <small className="text-muted">Step {currentStep + 1} of {steps.length}</small>
                    <h5 className="mt-1">{step.from.name} → {step.to.name}</h5>
                </div>

                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="text-center py-4">
                        <p className="fs-5 mb-3">{step.event.description}</p>
                        <Badge bg={effectColor} className="fs-6 px-3 py-2">{step.event.effect > 0 ? '+' : ''}{step.event.effect} coins</Badge>
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded shadow-sm mb-4">
                    <span className="text-muted">Coins remaining</span>
                    <strong className="fs-5">{step.coins}</strong>
                </div>
                <div className="text-center">
                    {isLast ? (
                        <Button variant="dark" size="lg" onClick={onDone}>See Final Score</Button>
                    ) : (
                        <Button variant="outline-dark" onClick={() => setCurrentStep(s => s + 1)}>Next Step</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ExecutionPhase;







