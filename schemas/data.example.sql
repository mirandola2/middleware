DROP TABLE IF EXISTS data;

CREATE TABLE IF NOT EXISTS data (
    member_code TEXT PRIMARY KEY,
    full_name TEXT,
    birthday TEXT
);

INSERT INTO data (member_code, full_name, birthday) VALUES
    ('0000000', 'John Doe', '2000-01-01');
 