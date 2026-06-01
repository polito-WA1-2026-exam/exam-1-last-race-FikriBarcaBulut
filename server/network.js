import db from './db.js';

export const getFullNetwork = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const stations = await new Promise((res, rej) => {
                db.all('SELECT id, name FROM stations ORDER BY name',[], (err, rows) => {
                    if(err){
                        return rej(err);
                    }
                    res(rows);
                });
            });

            const lines = await new Promise((res, rej) => {
                db.all('SELECT id, name FROM lines', [], (err, rows) => {
                    if(err){
                        return rej(err);
                    }
                    res(rows);
                });
            });

            const lineStations = await new Promise((res, rej)=> {
                db.all('SELECT lineId, stationId, position FROM lineStations ORDER BY lineId, position', [], (err, rows) => {
                    if(err){
                        return rej(err);
                    }
                    res(rows);
                });
            });

            resolve({stations, lines, lineStations});
        } catch(err) {
            reject(err);
        }
    });
};

export const getRandomEvent = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, description, effect FROM events ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
            if(err) return reject(err);
            resolve(row);
        });
    });
};