TRUNCATE authors, books RESTART IDENTITY;

INSERT INTO authors (name) 
VALUES
('Test Author 1'),
('Test Author 2');

INSERT INTO books (title, year_of_publication, abstract, author_id) 
VALUES
(
    'Test Book 1', 
    1991, 
    $str$Test book 1 description$str$,
    1
),
(
    'Test Book 2', 
    1992, 
    $str$Test book 2 description$str$,
    1
),
(
    'Test Book 3',
    1993,
    $str$Test book 3 description$str$,
    2

);