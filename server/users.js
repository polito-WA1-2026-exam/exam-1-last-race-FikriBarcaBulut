import crypto from 'crypto';
import db from './db.js';

export const getUser=(username, password)=> {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return reject(err);
            } if (!row) {
                return resolve(false);
            }

            crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {
                if(err){
                    return reject(err);
                }
                const stored=Buffer.from(row.hashedPassword, 'hex');
                if(stored.length===hashedPassword.length && crypto.timingSafeEqual(stored, hashedPassword)){
                    resolve({id: row.id, username: row.username});
                }else{
                    resolve(false);
                }
            });
        });
    });
};

export const getUserById=(id)=> {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, username FROM users WHERE id = ?', [id], (err, row) => (err ? reject(err) : resolve(row)));
    });
};