const SERVER = 'http://localhost:3001';

const handleResponse = async (res) => {
    if(res.ok) {
        const ct = res.headers.get('content-type') || '';
        return ct.includes('application/json') ? res.json() : null;
    }
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw body;
};

export const getCurrentUser = () => {
    return fetch(`${SERVER}/api/sessions/current`, { credentials: 'include' }).then(handleResponse);
};

export const login = (username, password) => {
    return fetch(`${SERVER}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    }).then(handleResponse);
};

export const logout = () => {
    return fetch(`${SERVER}/api/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(handleResponse);
};

export const getNetwork = () => {
    return fetch(`${SERVER}/api/network`, { credentials: 'include' }).then(handleResponse);
};

export const startGame = () => {
    return fetch(`${SERVER}/api/games`, {
        method: 'POST',
        credentials: 'include'
    }).then(handleResponse);
};

export const submitRoute = (gameId, route) => {
    return fetch(`${SERVER}/api/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ route })
    }).then(handleResponse);
};

export const getRanking = () => {
    return fetch(`${SERVER}/api/ranking`, { credentials: 'include' }).then(handleResponse);
};