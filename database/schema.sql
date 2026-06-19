
DROP TABLE IF EXISTS analytics;
DROP TABLE IF EXISTS records;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------
-- 1. USERS
-- ---------------------------------------------------------------
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,          -- store bcrypt hash
    role        VARCHAR(50)         NOT NULL DEFAULT 'user',
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO categories (name, description) VALUES
    ('Student',  'Students enrolled in courses'),
    ('Teacher',  'Teaching staff members'),
    ('Admin',    'Administrative personnel');


CREATE TABLE records (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150)        NOT NULL,
    email       VARCHAR(150),
    category_id INTEGER             NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    status      VARCHAR(20)         NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active', 'Completed', 'Pending')),
    notes       TEXT,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE analytics (
    id              SERIAL PRIMARY KEY,
    snapshot_date   DATE            NOT NULL DEFAULT CURRENT_DATE,
    total_records   INTEGER         NOT NULL DEFAULT 0,
    active_count    INTEGER         NOT NULL DEFAULT 0,
    completed_count INTEGER         NOT NULL DEFAULT 0,
    pending_count   INTEGER         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO records (name, email, category_id, status, created_at) VALUES
    ('Alice Johnson',  'alice@example.com',   1, 'Active',    NOW() - INTERVAL '30 days'),
    ('Bob Smith',      'bob@example.com',     2, 'Completed', NOW() - INTERVAL '25 days'),
    ('Carol White',    'carol@example.com',   1, 'Pending',   NOW() - INTERVAL '20 days'),
    ('David Brown',    'david@example.com',   3, 'Active',    NOW() - INTERVAL '15 days'),
    ('Eva Green',      'eva@example.com',     1, 'Active',    NOW() - INTERVAL '10 days'),
    ('Frank Black',    'frank@example.com',   2, 'Pending',   NOW() - INTERVAL '5 days'),
    ('Grace Lee',      'grace@example.com',   3, 'Completed', NOW() - INTERVAL '3 days'),
    ('Henry King',     'henry@example.com',   1, 'Active',    NOW() - INTERVAL '2 days'),
    ('Iris Scott',     'iris@example.com',    2, 'Active',    NOW() - INTERVAL '1 day'),
    ('Jack Turner',    'jack@example.com',    1, 'Completed', NOW());


CREATE OR REPLACE VIEW vw_dashboard_summary AS
SELECT
    COUNT(*)                                        AS total_records,
    COUNT(*) FILTER (WHERE status = 'Active')       AS active_records,
    COUNT(*) FILTER (WHERE status = 'Completed')    AS completed_records,
    COUNT(*) FILTER (WHERE status = 'Pending')      AS pending_records
FROM records;

CREATE OR REPLACE VIEW vw_category_distribution AS
SELECT
    c.name          AS category,
    COUNT(r.id)     AS record_count
FROM categories c
LEFT JOIN records r ON r.category_id = c.id
GROUP BY c.name;

CREATE OR REPLACE VIEW vw_monthly_trend AS
SELECT
    TO_CHAR(created_at, 'YYYY-MM')  AS month,
    COUNT(*)                         AS records_created
FROM records
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month;
select* from analytics;
select* from categories;
select* from records;
select* from users;
