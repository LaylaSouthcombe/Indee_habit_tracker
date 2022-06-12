DROP TABLE IF EXISTS habits_info;

CREATE TABLE habits_info (
    id serial PRIMARY KEY,
    user_id int NOT NULL,
    type varchar(20) NOT NULL,
    description varchar(30) NOT NULL,
    freq_unit varchar(20) NOT NULL,
    freq_value int NOT NULL,
    goal int NOT NULL,
    streak int DEFAULT 0
);