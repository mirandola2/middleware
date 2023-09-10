DROP TABLE IF EXISTS data;

CREATE TABLE IF NOT EXISTS data (
    fiscal_code TEXT PRIMARY KEY,
    member_code TEXT,
    full_name TEXT,
    birthday TEXT
);

INSERT INTO data (fiscal_code, member_code, full_name, birthday) VALUES
    ('doejhn00c01f340o', '0000000', 'John Doe', '2000-01-01');
 