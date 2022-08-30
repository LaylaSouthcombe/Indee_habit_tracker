INSERT INTO carers (first_name, second_name, password_digest, email) 
VALUES
('Tina', 'Belcher', '$2b$10$SoRwECew2HFsTf6y5qplPeKmQgZX.nRVvNxxpkbGfJV47emS8TfBq', 'tinab123@gmail.com'),
('David', 'Fenix', 'xxxx', 'davidfenix@gmail.com');

INSERT INTO users (first_name, second_name, password_digest, email, carer_id, last_login) 
VALUES
('Tina', 'Smith', 'xxxx', 'tinasmith@gmail.com', 1, '2022-06-12 00:00:00'),
('Tom', 'White', 'xxxx', 'tomwhite@gmail.com', 2, '2022-06-11 00:00:00'),
('Gina', 'Hurst', 'xxxx', 'ginahurst@gmail.com', 1, '2022-06-14 00:00:00'),
('Bob', 'Turner', 'xxxx', 'bobturner@gmail.com', 0, '2022-06-12 00:00:00'),
('Gene', 'Belcher', '$2b$10$qBAD4lPJH6AsJse9f8Vb3eUzJ7H3C8ZlHxoGh2rJB9kGhJxecSlK.', 'genebelcher123@gmail.com', 1, '2022-06-10 00:00:00');

INSERT INTO habits_info (user_id, type, description, freq_unit, freq_value, goal) 
VALUES
(1, 'boolean', 'Take medicine in morning', 'day', 1, 1),
(5, 'int', 'Drink 8 glasses of water', 'day', 1, 8),
(5, 'boolean', 'Exercise', 'day', 2, 30),
(5, 'int', 'Brush teeth', 'day', 1, 2);

INSERT INTO int_entries (habit_int_id, habit_int_entry, date) 
VALUES
(2, 6, '2022-08-28 20:59:15.933'),
(2, 8, '2022-08-27 20:59:15.933'),
(2, 9, '2022-08-26 20:59:15.933'),
(2, 3, '2022-08-25 20:59:15.933'),
(2, 4, '2022-08-24 20:59:15.933'),
(2, 5, '2022-08-23 20:59:15.933'),
(2, 8, '2022-08-22 20:59:15.933'),
(2, 6, '2022-08-19 20:59:15.933'),
(4, 1, '2022-08-26 20:59:15.933');

INSERT INTO boolean_entries (habit_bln_id, habit_bln_entry, date) 
VALUES
(1, true, '2022-08-28 20:59:15.933'),
(3, false, '2022-08-28 20:59:15.933'),
(3, true, '2022-08-27 20:59:15.933'),
(3, false, '2022-08-26 20:59:15.933'),
(3, false, '2022-08-25 20:59:15.933'),
(3, false, '2022-08-24 20:59:15.933'),
(3, false, '2022-08-23 20:59:15.933'),
(3, false, '2022-08-22 20:59:15.933');

INSERT INTO requests (user_id, carer_id, status) 
VALUES
(1, 1, 'accepted');