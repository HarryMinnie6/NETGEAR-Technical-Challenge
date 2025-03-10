-- Create the books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    published_year INTEGER NOT NULL,
    total_copies INTEGER NOT NULL,
    copies_available INTEGER NOT NULL
);

-- Create the book_reservations table
CREATE TABLE IF NOT EXISTS book_reservations (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    reserver_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
