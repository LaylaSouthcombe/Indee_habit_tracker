DROP TABLE IF EXISTS int_entries;

CREATE TABLE int_entries (
    id serial PRIMARY KEY,
    habit_int_id int NOT NULL,
    habit_int_entry int NOT NULL DEFAULT 0,
    date date DEFAULT CURRENT_TIMESTAMP 
);

DROP TABLE IF EXISTS boolean_entries;

CREATE TABLE boolean_entries (
    id serial PRIMARY KEY,
    habit_bln_id int NOT NULL,
    habit_bln_entry boolean NOT NULL DEFAULT false,
    date date DEFAULT CURRENT_TIMESTAMP 
);