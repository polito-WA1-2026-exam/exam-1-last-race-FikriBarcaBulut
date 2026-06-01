// imports
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { getUser, getUserById } from './users.js';
import { getFullNetwork, getRandomEvent } from './network.js';
import { createGame, getGame, completeGame, getRanking } from './games.js';
import { getRandomStartDest, validateRoute } from './routeUtils.js';

// init express
const app = express();
const PORT = 3001;

// activate the server
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await getUser(username, password);
        if(!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    } catch(err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});

app.use(session({ secret: 'rtr-exam-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated.' });
};

const deriveSegments = (lineStations, stationMap) => {
    const byLine = {};
    for(const ls of lineStations) {
        if(!byLine[ls.lineId]) {
            byLine[ls.lineId] = [];
        }
        byLine[ls.lineId].push(ls);
    }
    const seen = new Set();
    const segments = [];
    for(const lineId of Object.keys(byLine)) {
        const sorted = byLine[lineId].sort((a, b) => a.position - b.position);
        for(let i = 0; i < sorted.length - 1; i++) {
            const a = sorted[i].stationId;
            const b = sorted[i + 1].stationId;
            const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
            if(!seen.has(key)) {
                seen.add(key);
                segments.push({ from: stationMap[a], to: stationMap[b] });
            }
        }
    }
    return segments;
};

app.post('/api/sessions', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            return next(err);
        }
        if(!user) {
            return res.status(401).json({ error: info?.message ?? 'Login failed.' });
        }
        req.login(user, (err) => {
            if(err) {
                return next(err);
            }
            res.json(req.user);
        });
    })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Not authenticated.' });
    }
});

app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => res.status(200).end());
});

app.get('/api/network', isLoggedIn, async (req, res) => {
    try {
        const network = await getFullNetwork();
        res.json(network);
    } catch(err) {
        res.status(500).json({ error: 'Failed to retrieve network.' });
    }
});

app.post('/api/games', isLoggedIn, async (req, res) => {
    try {
        const network = await getFullNetwork();
        const { startStation, destStation } = getRandomStartDest(network.stations, network.lineStations);
        const gameId = await createGame(req.user.id, startStation.id, destStation.id);
        const stationMap = {};
        for(const s of network.stations) {
            stationMap[s.id] = s;
        }
        const segments = deriveSegments(network.lineStations, stationMap);
        res.status(201).json({ gameId, startStation, destStation, segments, stations: network.stations });
    } catch(err) {
        res.status(500).json({ error: 'Failed to start game.' });
    }
});

app.put('/api/games/:id', isLoggedIn, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const { route } = req.body ?? {};

        if(!route || !Array.isArray(route)) {
            return res.status(400).json({ error: 'Route is required.' });
        }

        const game = await getGame(gameId, req.user.id);
        if(!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }
        if(game.status === 'completed') {
            return res.status(400).json({ error: 'Game already completed.' });
        }

        const network = await getFullNetwork();
        const result = validateRoute(route, network.lineStations, game.startStationId, game.destinationStationId);

        if(!result.valid) {
            await completeGame(gameId, 0);
            return res.json({ valid: false, reason: result.reason, finalScore: 0 });
        }

        const stationMap = {};
        for(const s of network.stations) {
            stationMap[s.id] = s;
        }

        let coins = 20;
        const steps = [];
        for(const seg of route) {
            const event = await getRandomEvent();
            coins += event.effect;
            steps.push({
                from: stationMap[seg.from],
                to: stationMap[seg.to],
                event: { description: event.description, effect: event.effect },
                coins
            });
        }

        const finalScore = Math.max(0, coins);
        await completeGame(gameId, finalScore);
        res.json({ valid: true, steps, finalScore });
    } catch(err) {
        res.status(500).json({ error: 'Failed to process route.' });
    }
});

app.get('/api/ranking', isLoggedIn, async (req, res) => {
    try {
        const ranking = await getRanking();
        res.json(ranking);
    } catch(err) {
        res.status(500).json({ error: 'Failed to retrieve ranking.' });
    }
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));