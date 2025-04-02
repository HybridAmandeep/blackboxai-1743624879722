const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 8000;

// Database connection
const db = new sqlite3.Database('../railway.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
    console.log('Connected to railway database');
});

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints

// Get all trains with station names
app.get('/api/trains', (req, res) => {
    const sql = `
    SELECT t.*, 
           s1.name as start_station_name, 
           s2.name as end_station_name 
    FROM Trains t
    JOIN Stations s1 ON t.start_station_id = s1.station_id
    JOIN Stations s2 ON t.end_station_id = s2.station_id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Search trains between stations
app.get('/api/trains/search', (req, res) => {
    const { from, to, date } = req.query;
    const sql = `
    SELECT t.*, 
           s1.name as from_station, 
           s2.name as to_station
    FROM Trains t
    JOIN Stations s1 ON t.start_station_id = s1.station_id
    JOIN Stations s2 ON t.end_station_id = s2.station_id
    WHERE s1.code = ? AND s2.code = ?
    `;
    db.all(sql, [from, to], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get station list
app.get('/api/stations', (req, res) => {
    db.all('SELECT * FROM Stations', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Initialize database tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Bookings (
        booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
        pnr TEXT UNIQUE NOT NULL,
        train_id INTEGER NOT NULL,
        user_id INTEGER,
        journey_date TEXT NOT NULL,
        passengers TEXT NOT NULL,
        status TEXT DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(train_id) REFERENCES Trains(train_id)
    )`);
});

// Create booking
app.post('/api/bookings', (req, res) => {
    const { train_id, passengers, journey_date } = req.body;
    const pnr = 'PNR' + Math.floor(100000 + Math.random() * 900000);
    
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Insert booking
        db.run(
            `INSERT INTO Bookings (pnr, train_id, journey_date, passengers) 
             VALUES (?, ?, ?, ?)`,
            [pnr, train_id, journey_date, JSON.stringify(passengers)],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
                
                // Update seat availability
                // Add your seat inventory logic here
                
                db.run('COMMIT', (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ 
                        pnr,
                        status: 'confirmed',
                        booking_id: this.lastID 
                    });
                });
            }
        );
    });
});

// Get booking by PNR
app.get('/api/bookings/:pnr', (req, res) => {
    db.get(
        `SELECT b.*, t.name as train_name 
         FROM Bookings b
         JOIN Trains t ON b.train_id = t.train_id
         WHERE pnr = ?`,
        [req.params.pnr],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Booking not found' });
            
            res.json({
                ...row,
                passengers: JSON.parse(row.passengers)
            });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Endpoints:`);
    console.log(`- GET    /api/trains`);
    console.log(`- GET    /api/trains/search?from=CODE&to=CODE`);
    console.log(`- GET    /api/stations`);
    console.log(`- POST   /api/bookings`);
});