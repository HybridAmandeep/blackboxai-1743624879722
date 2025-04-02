-- SQLite-Compatible Database Schema
PRAGMA foreign_keys = ON;

CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
    is_verified INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Stations (
    station_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    zone TEXT NOT NULL
);

CREATE TABLE Trains (
    train_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    start_station_id INTEGER NOT NULL,
    end_station_id INTEGER NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    distance_km INTEGER NOT NULL,
    FOREIGN KEY (start_station_id) REFERENCES Stations(station_id),
    FOREIGN KEY (end_station_id) REFERENCES Stations(station_id)
);

-- Insert stations first (required for train foreign keys)
INSERT INTO Stations (code, name, zone) VALUES
('DEL', 'Delhi', 'NR'),
('MUM', 'Mumbai', 'WR'),
('CHE', 'Chennai', 'SR'),
('BAN', 'Bangalore', 'SWR');

-- Create index after tables exist
CREATE INDEX idx_train_search ON Trains(start_station_id, end_station_id);