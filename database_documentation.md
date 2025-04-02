# Railway Database Schema Documentation

## Tables Structure

### Users
- `user_id` (PK, AUTOINCREMENT)
- `username` (UNIQUE)
- `email` (UNIQUE) 
- `password_hash`
- `role` (user/admin)
- `is_verified` (0/1)
- `created_at` (TIMESTAMP)

### Stations  
- `station_id` (PK, AUTOINCREMENT)
- `code` (UNIQUE)
- `name`
- `zone`

### Trains
- `train_id` (PK, AUTOINCREMENT)
- `train_code` (UNIQUE)
- `name`
- `start_station_id` (FK → Stations)
- `end_station_id` (FK → Stations)  
- `departure_time`
- `arrival_time`
- `distance_km`

## Sample Data
```sql
-- Stations
1|DEL|Delhi|NR
2|MUM|Mumbai|WR
3|CHE|Chennai|SR  
4|BAN|Bangalore|SWR

-- Trains
1|12345|Rajdhani Express|1|2|18:30|08:30|1400
2|12346|Shatabdi Express|1|2|06:00|20:00|1400
3|12347|Duronto Express|3|4|12:00|06:00|1200

-- Admin User
username: admin
password: admin123
```

## Verification
- Foreign keys: Valid
- Indexes: idx_train_search (start_station_id, end_station_id)