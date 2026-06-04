import { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import * as API from '../API.js';

function RankingPage() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {API.getRanking().then(data => setRanking(data)).catch(() => setError('Failed to load ranking.')).finally(() => setLoading(false));}, []);

    if(loading) {
        return (
            <Container className="mt-5 text-center"><Spinner animation="border" variant="dark" /></Container>
        );
    }
    return (
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h4 className="mb-4">Ranking</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {ranking.length === 0 ? (
                <p className="text-muted">No completed games yet.</p>
            ) : (
                <Table bordered hover className="bg-white shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: '60px' }}>#</th>
                            <th>Player</th>
                            <th style={{ width: '120px' }}>Best Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((entry, idx) => (
                            <tr key={entry.username}>
                                <td className="text-muted">{idx + 1}</td>
                                <td>{entry.username}</td>
                                <td className="fw-semibold">{entry.bestScore} coins</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
export default RankingPage;




