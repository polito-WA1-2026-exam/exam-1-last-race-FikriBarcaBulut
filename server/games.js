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
            `SELECT u.username, MAX(g.score) AS bestScore
             FROM games g JOIN users u ON g.userId = u.id
             WHERE g.status = 'completed'
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