const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ideas.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the ideas database.');
    }
});

db.serialize(() => {
    db.each(`SELECT * FROM ideas`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row);
    });
});

db.close();
