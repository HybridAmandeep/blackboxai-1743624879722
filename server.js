const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 8000;

// Database connection
const db = new sqlite3.Database('./railway.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
    console.log('Connected to railway database');
});

// Middleware
app.use(express.json());

// API Endpoints

// Get all trains
app.get('/api/trains', (req, res) => {
    db.all('SELECT * FROM Trains', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get all stations
app.get('/api/stations', (req, res) => {
    db.all('SELECT * FROM Stations', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});