-- Create the books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    published_date INTEGER NOT NULL,
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

-- Insert sample data into books table
INSERT INTO books (title, author, genre, published_date, total_copies, copies_available) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 1925, 10, 7),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 1960, 15, 12),
('1984', 'George Orwell', 'Dystopian', 1949, 12, 5),
('Pride and Prejudice', 'Jane Austen', 'Romance', 1813, 8, 6),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 1951, 10, 4),
('Moby-Dick', 'Herman Melville', 'Adventure', 1851, 7, 3),
('War and Peace', 'Leo Tolstoy', 'Historical', 1869, 5, 2),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 1937, 14, 10),
('Crime and Punishment', 'Fyodor Dostoevsky', 'Psychological Fiction', 1866, 9, 7),
('Brave New World', 'Aldous Huxley', 'Dystopian', 1932, 11, 6);
