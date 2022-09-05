DROP TABLE IF EXISTS carers;

CREATE TABLE carers (
    id serial PRIMARY KEY,
    first_name varchar(100) NOT NULL,
    second_name varchar(100) NOT NULL,
    password_digest varchar NOT NULL,
    email varchar(200) NOT NULL UNIQUE
);