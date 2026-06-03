import { useState, useEffect } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import SetupPhase from './SetupPhase.jsx';
import PlanningPhase from './PlanningPhase.jsx';
import ExecutionPhase from './ExecutionPhase.jsx';
import ResultPhase from './ResultPhase.jsx';
import * as API from '../API.js';

function GamePage({ user }) {
    const [phase, setPhase] = useState('setup');
    const [network, setNetwork] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [executionData, setExecutionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        API.getNetwork()
            .then(data => setNetwork(data))
            .catch(() => setError('Failed to load the network.'))
            .finally(() => setLoading(false));
    }, []);

    const handleReady = async () => {
        try {
            const data = await API.startGame();
            setGameData(data);
            setPhase('planning');
        } catch(err) {
            setError('Failed to start the game.');
        }
    };

    const handleSubmitRoute=async(route)=>{
        try {
            const data = await API.submitRoute(gameData.gameId, route);
            setExecutionData(data);
            setPhase('execution');
        } catch(err) {
            setError('Failed to submit route.');
        }
    };

    const handleExecutionDone=()=>{
        setPhase('result');
    };
    const handlePlayAgain=()=>{
        setGameData(null);
        setExecutionData(null);
        setError('');
        setPhase('setup');
    };

    if(loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="dark"/>
            </Container>
        );
    }

    return (
        <Container fluid="lg" className="mt-4">
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {phase === 'setup' && <SetupPhase network={network} onReady={handleReady}/>}
            {phase === 'planning' && <PlanningPhase gameData={gameData} onSubmit={handleSubmitRoute}/>}
            {phase === 'execution' && <ExecutionPhase executionData={executionData} onDone={handleExecutionDone}/>}
            {phase ==='result' && <ResultPhase executionData={executionData} onPlayAgain={handlePlayAgain}/>}
        </Container>
    );
}
export default GamePage;


