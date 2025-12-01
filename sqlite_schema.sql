-- SQLite-Datenbankstruktur für die Hundeschule-Verwaltung
-- Diese Definition bildet die Daten ab, die auf der Webseite dargestellt werden.

PRAGMA foreign_keys = ON;

CREATE TABLE owners (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE dogs (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  vaccinated BOOLEAN DEFAULT false,
  next_vaccine_due DATE
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  next_session DATE
);

CREATE TABLE enrollments (
  dog_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (dog_id, course_id)
);

CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  dog_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beispielhafte Datensätze, die auf der Seite angezeigt werden
INSERT INTO owners (id, name, email) VALUES
  (1, 'Julia Berger', 'julia@berger.de'),
  (2, 'Markus Hahn', 'markus@hahn.de'),
  (3, 'Leonie Kraft', 'leonie@kraft.de');

INSERT INTO dogs (id, owner_id, name, breed, vaccinated, next_vaccine_due) VALUES
  (1, 1, 'Luna', 'Australian Shepherd', 1, '2025-05-10'),
  (2, 2, 'Milo', 'Labrador', 0, '2025-04-05'),
  (3, 3, 'Nala', 'Mischling', 1, '2025-07-21');

INSERT INTO courses (id, title, next_session) VALUES
  (1, 'Welpengruppe', '2025-04-08'),
  (2, 'Grundkurs Gehorsam', '2025-04-12'),
  (3, 'Agility Einsteiger', '2025-04-15');

INSERT INTO enrollments (dog_id, course_id, enrolled_at) VALUES
  (1, 2, '2025-03-20'),
  (2, 1, '2025-03-18'),
  (3, 3, '2025-03-22');

INSERT INTO documents (id, dog_id, file_name, file_type, uploaded_at) VALUES
  (1, 1, 'Impfpass_Luna.pdf', 'pdf', '2025-03-05 10:30:00'),
  (2, 3, 'Impfpass_Nala.pdf', 'pdf', '2025-03-09 16:45:00');
