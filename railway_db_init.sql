-- Railway Management System Database Initialization
-- Core Tables

CREATE TABLE IF NOT EXISTS Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Stations (
    station_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(5) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Trains (
    train_id INT PRIMARY KEY AUTO_INCREMENT,
    train_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_station_id INT NOT NULL,
    end_station_id INT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    distance_km INT NOT NULL,
    FOREIGN KEY (start_station_id) REFERENCES Stations(station_id),
    FOREIGN KEY (end_station_id) REFERENCES Stations(station_id)
);

-- Additional tables and sample data would continue here...
-- (Full schema as shown in previous response)

-- Sample Data Insertion
INSERT INTO Stations (code, name, zone) VALUES
('DEL', 'Delhi', 'NR'),
('MUM', 'Mumbai', 'WR'),
('CHE', 'Chennai', 'SR'),
('BAN', 'Bangalore', 'SWR');

-- Index Creation
CREATE INDEX idx_train_search ON Trains(start_station_id, end_station_id);