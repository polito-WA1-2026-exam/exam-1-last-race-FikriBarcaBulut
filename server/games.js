import db from './db.js';

export const createGame = (userId, startStationId, destinationStationId) => {
    return new Promise((resolve, reject)=>{
        db.run(
            'INSERT INTO games (userId, startStationId, destinationStationId) VALUES (?, ?, ?)',
            [userId, startStationId, destinationStationId],
            function(err){
                if(err){
                    return reject(err);
                }
                resolve(this.lastID);
            }
        );
    });
};

export const getGame = (gameId, userId)=>{
    return new Promise((resolve, reject)=>{
        db.get(
            'SELECT * FROM games WHERE id = ? AND userId = ?',
            [gameId, userId],
            (err, row)=>{
                if(err) {
                    return reject(err);
                }
                resolve(row);
            }
        );
    });
};

export const completeGame = (gameId, score)=>{
    return new Promise((resolve, reject)=>{
        db.run(
            'UPDATE games SET score = ?, status = ? WHERE id = ?',
            [score, 'completed', gameId],
            (err)=>{
                if(err){
                    return reject(err);
                }
                resolve();
            }
        );
    });
};
export const getRanking = ()=>{
    return new Promise((resolve, reject)=>{
        db.all(
            `SELECT u.username, g.score AS bestScore,
                    s1.name AS startStation, s2.name AS destStation
             FROM games g
             JOIN users u ON g.userId = u.id
             JOIN stations s1 ON g.startStationId = s1.id
             JOIN stations s2 ON g.destinationStationId = s2.id
             WHERE g.status = 'completed'
               AND g.score = (
                 SELECT MAX(g2.score) FROM games g2
                 WHERE g2.userId = g.userId AND g2.status = 'completed'
               )
             GROUP BY g.userId
             ORDER BY bestScore DESC`,
            [],
            (err, rows) => {
                if(err){
                    return reject(err);
                }
                resolve(rows);
            }
        );
    });
};

