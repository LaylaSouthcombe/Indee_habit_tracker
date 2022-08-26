INSERT INTO carers (first_name, second_name, password_digest, email) 
VALUES
('Gemma', 'Horsham', 'xxxx', 'gemmahorsham@gmail.com'),
('David', 'Fenix', 'xxxx', 'davidfenix@gmail.com');

INSERT INTO users (first_name, second_name, password_digest, email, carer_id, last_login) 
VALUES
('Tina', 'Smith', 'xxxx', 'tinasmith@gmail.com', 1, '2022-06-12 00:00:00'),
('Tom', 'White', 'xxxx', 'tomwhite@gmail.com', 2, '2022-06-11 00:00:00'),
('Gina', 'Hurst', 'xxxx', 'ginahurst@gmail.com', 1, '2022-06-10 00:00:00'),
('Bob', 'Turner', 'xxxx', 'bobturner@gmail.com', 0, '2022-06-10 00:00:00'),
('Gene', 'Belcher', '$2b$10$qBAD4lPJH6AsJse9f8Vb3eUzJ7H3C8ZlHxoGh2rJB9kGhJxecSlK.', 'genebelcher123@gmail.com', 0, '2022-06-10 00:00:00');

INSERT INTO habits_info (user_id, type, description, freq_unit, freq_value, goal) 
VALUES
(1, 'boolean', 'Take medicine in morning', 'days', 1, 1),
(5, 'int', 'Drink 8 glasses of water', 'days', 1, 8),
(5, 'boolean', 'Exercise', 'days', 2, 30),
(5, 'int', 'Brush teeth', 'days', 1, 2);

INSERT INTO int_entries (habit_int_id, habit_int_entry) 
VALUES
(2, 8),
(4, 1);

INSERT INTO boolean_entries (habit_bln_id, habit_bln_entry) 
VALUES
(1, true),
(3, false);

INSERT INTO requests (user_id, carer_id, status) 
VALUES
(1, 1, 'accepted');