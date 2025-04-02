-- Sample data for IRCTC database
BEGIN TRANSACTION;

-- Insert sample trains (Delhi to Mumbai)
INSERT INTO Trains (train_code, name, start_station_id, end_station_id, departure_time, arrival_time, distance_km) VALUES
('12345', 'Rajdhani Express', 1, 2, '18:30:00', '08:30:00', 1400),
('12346', 'Shatabdi Express', 1, 2, '06:00:00', '20:00:00', 1400);

-- Insert Chennai to Bangalore train
INSERT INTO Trains (train_code, name, start_station_id, end_station_id, departure_time, arrival_time, distance_km) VALUES
('12347', 'Duronto Express', 3, 4, '12:00:00', '06:00:00', 1200);

-- Create admin user (password: admin123)
INSERT INTO Users (username, email, password_hash, role, is_verified) VALUES
('admin', 'admin@irctc.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH/r7iW2m2Xr0SAaGpqB2lJYyYHdO0e', 'admin', 1);

COMMIT;

-- Verify inserts
SELECT * FROM Trains;
SELECT * FROM Users WHERE role = 'admin';