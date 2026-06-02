import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import InstructionsPage from './components/InstructionsPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import GamePage from './components/GamePage.jsx';
import RankingPage from './components/RankingPage.jsx';
import * as API from './API.js';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        API.getCurrentUser()
            .then(u => setUser(u))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleLogin = async (username, password) => {
        const u = await API.login(username, password);
        setUser(u);
        navigate('/game');
    };

    const handleLogout = async () => {
        await API.logout();
        setUser(null);
        navigate('/');
    };

    if(loading) {
        return null;
    }

    return (
        <>
            <NavBar user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={user ? <Navigate to="/game" /> : <InstructionsPage />} />
                <Route path="/login" element={user ? <Navigate to="/game" /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/game" element={user ? <GamePage user={user} /> : <Navigate to="/" />} />
                <Route path="/ranking" element={user ? <RankingPage /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;