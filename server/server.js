const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
const dbPath = path.resolve(__dirname, 'ideas.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    // For development: Reset table to support schema change (ID from INTEGER to TEXT)
    // db.run("DROP TABLE IF EXISTS ideas"); // Uncomment if you want to force reset, or handle migration manually.
    // However, to ensure the new schema is used if the user just runs this, we might need to be aggressive or ask user.
    // I will enable the drop for now as this is likely a prototype.
    // db.run("DROP TABLE IF EXISTS ideas", () => { // UNCOMMENT THIS TO RESET DATABASE
    db.run(`CREATE TABLE IF NOT EXISTS ideas (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        impacted_users INTEGER NOT NULL,
        status TEXT DEFAULT 'Created',
        evaluator_comments TEXT,
        budget REAL,
        leadership_approval INTEGER DEFAULT 0,
        dev_effort_estimate TEXT,
        start_date TEXT,
        end_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
            console.error('Error creating table', err.message);
        } else {
            console.log('Ideas table ready (Schema: Manual ID).');
        }
    });
    // });
}

// Routes

// 1. Idea Creation & 2. Auto Triage
app.post('/api/ideas', (req, res) => {
    const { id, title, description, impacted_users } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    // Auto Triage Logic
    let status = 'Created';
    if (impacted_users >= 100) {
        status = 'Valid';
    } else {
        status = 'Archived';
    }

    const sql = `INSERT INTO ideas (id, title, description, impacted_users, status) VALUES (?, ?, ?, ?, ?)`;
    const params = [id, title, description, impacted_users, status];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Idea created',
            data: {
                id: id,
                title,
                description,
                impacted_users,
                status
            }
        });
    });
});

// Get all ideas
app.get('/api/ideas', (req, res) => {
    const sql = 'SELECT * FROM ideas ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get single idea
app.get('/api/ideas/:id', (req, res) => {
    const sql = 'SELECT * FROM ideas WHERE id = ?';
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// 3. Idea Evaluation & Approval
app.put('/api/ideas/:id/evaluate', (req, res) => {
    const { evaluator_comments, approved } = req.body;
    // If approved by evaluator, maybe it stays 'Valid' waiting for budget, or goes to 'Evaluated'?
    // User flow: "confirms if the idea is worth". Let's assume this moves it to 'Evaluated' state ready for Leadership.
    // If not approved, maybe 'Archived'? Let's keep it simple: Moves to 'Evaluated' if positive.

    // Simplification: We just update comments and status.
    const status = approved ? 'Evaluated' : 'Archived';

    const sql = `UPDATE ideas SET evaluator_comments = ?, status = ? WHERE id = ?`;
    const params = [evaluator_comments, status, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Idea evaluated', changes: this.changes });
    });
});

// 4. Leadership, Budget Allocation, Approval
app.put('/api/ideas/:id/budget', (req, res) => {
    const { budget, leadership_approval } = req.body;
    // If approved and budget allocated -> 'Budgeted'

    // Check if previously 'Evaluated' or 'Valid'? (Skipping strict state checks for simplicity)
    const status = leadership_approval ? 'Budgeted' : 'Archived';

    const sql = `UPDATE ideas SET budget = ?, leadership_approval = ?, status = ? WHERE id = ?`;
    const params = [budget, leadership_approval ? 1 : 0, status, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Budget allocated', changes: this.changes });
    });
});

// 5. Idea Execution (Development Estimation)
app.put('/api/ideas/:id/estimation', (req, res) => {
    const { dev_effort_estimate } = req.body;
    const status = 'In Development'; // Or 'Ready for Dev'

    const sql = `UPDATE ideas SET dev_effort_estimate = ?, status = ? WHERE id = ?`;
    const params = [dev_effort_estimate, status, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Estimation added', changes: this.changes });
    });
});

// 6. Idea Execution Time & Delivery
app.put('/api/ideas/:id/schedule', (req, res) => {
    const { start_date, end_date } = req.body;
    const status = 'Scheduled';

    const sql = `UPDATE ideas SET start_date = ?, end_date = ?, status = ? WHERE id = ?`;
    const params = [start_date, end_date, status, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Scheduled', changes: this.changes });
    });
});

// 7. Idea Go Live
app.put('/api/ideas/:id/golive', (req, res) => {
    const status = 'Live';
    const sql = `UPDATE ideas SET status = ? WHERE id = ?`;
    const params = [status, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Live', changes: this.changes });
    });
});

// 8. Delete Idea
app.delete('/api/ideas/:id', (req, res) => {
    const sql = 'DELETE FROM ideas WHERE id = ?';
    const params = [req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'deleted', changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
