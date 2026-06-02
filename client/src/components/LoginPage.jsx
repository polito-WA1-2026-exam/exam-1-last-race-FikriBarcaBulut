import { useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';

function LoginPage({ onLogin }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');

        if(!username.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            await onLogin(username, password);
        } catch(err) {
            setError(err.error || 'Incorrect username or password.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }} className="shadow-sm">
                <Card.Body className="p-4">
                    <Card.Title className="mb-4">Login</Card.Title>
                    {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="w-100" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default LoginPage;



