DROP TABLE IF EXISTS requests;

CREATE TABLE requests (
    id serial PRIMARY KEY,
    user_id int NOT NULL,
    carer_id int NOT NULL,
    status varchar(20) DEFAULT 'pending',
    date date DEFAULT CURRENT_TIMESTAMP
);