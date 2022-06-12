TRUNCATE carers, users, habits_info, int_entries, boolean_entries RESTART IDENTITY;

INSERT INTO carers (first_name, second_name, password_digest, email) 
VALUES
('Gemma', 'Horsham', 'xxxx', 'gemmahorsham@gmail.com'),
('David', 'Fenix', 'xxxx', 'davidfenix@gmail.com');

INSERT INTO users (first_name, second_name, password_digest, email, carer_id) 
VALUES
('Tina', 'Smith', 'xxxx', 'tinasmith@gmail.com', 1),
('Tom', 'White', 'xxxx', 'tomwhite@gmail.com', 2),
('Gina', 'Hurst', 'xxxx', 'ginahurst@gmail.com', 1);

INSERT INTO habits_info (user_id, type, description, freq_unit, freq_value, goal) 
VALUES
(1, 'boolean', 'Take medicine in morning', 'days', 1, 1),
(1, 'int', 'Drink 8 glasses of water', 'days', 1, 8),
(2, 'boolean', 'Exercise', 'days', 2, 1),
(3, 'int', 'Brush teeth', 'days', 1, 2);

INSERT INTO int_entries (habit_int_id, habit_int_entry) 
VALUES
(2, 8),
(4, 1);

INSERT INTO boolean_entries (habit_bln_id, habit_bln_entry) 
VALUES
(2, true),
(4, false);