import { Button } from 'react-bootstrap';
import NetworkMap from './NetworkMap.jsx';

function SetupPhase({ network, onReady }) {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">Network Map</h4>
                    <p className="text-muted mb-0">Study the network carefully before the planning phase begins.</p>
                </div>
                <Button variant="dark" size="lg" onClick={onReady}>
                    I'm Ready
                </Button>
            </div>
            <NetworkMap network={network} showLines={true} />
        </div>
    );
}
export default SetupPhase;

