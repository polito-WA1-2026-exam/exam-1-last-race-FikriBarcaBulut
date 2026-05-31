PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stations (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS lines (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS lineStations (
  lineId    INTEGER NOT NULL REFERENCES lines(id),
  stationId INTEGER NOT NULL REFERENCES stations(id),
  position  INTEGER NOT NULL,
  PRIMARY KEY (lineId, stationId)
);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  effect      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  username       TEXT NOT NULL UNIQUE,
  hashedPassword TEXT NOT NULL,
  salt           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  userId               INTEGER NOT NULL REFERENCES users(id),
  startStationId       INTEGER NOT NULL REFERENCES stations(id),
  destinationStationId INTEGER NOT NULL REFERENCES stations(id),
  score                INTEGER,
  status               TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'completed')),
  createdAt            TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO stations (name) VALUES
  ('Bornova'),
  ('Ege University'),
  ('Basmane'),
  ('Konak'),
  ('Ucyol'),
  ('Fahrettin Altay'),
  ('Alsancak'),
  ('Cankaya'),
  ('Goztepe'),
  ('Buca'),
  ('Cigli'),
  ('Karsiyaka'),
  ('Kadifekale'),
  ('Hatay');

INSERT INTO lines (name) VALUES
  ('Red Line'),
  ('Blue Line'),
  ('Green Line'),
  ('Yellow Line');

INSERT INTO lineStations (lineId, stationId, position) VALUES
  (1, 1,  1),
  (1, 2,  2),
  (1, 3,  3),
  (1, 4,  4),
  (1, 5,  5),
  (1, 6,  6);

INSERT INTO lineStations (lineId, stationId, position) VALUES
  (2, 7,  1),
  (2, 3,  2),
  (2, 8,  3),
  (2, 9,  4),
  (2, 10, 5);

INSERT INTO lineStations (lineId, stationId, position) VALUES
  (3, 1,  1),
  (3, 11, 2),
  (3, 12, 3),
  (3, 7,  4),
  (3, 4,  5);

INSERT INTO lineStations (lineId, stationId, position) VALUES
  (4, 4,  1),
  (4, 13, 2),
  (4, 14, 3),
  (4, 9,  4),
  (4, 5,  5);

INSERT INTO events (description, effect) VALUES
  ('The driver stops mid-route to rant about CSS flexbox. He draws diagrams. The train waits.', -2),
  ('A seagull boards and refuses to leave for three stops. It has a valid ticket.', -1),
  ('You find a note on your seat: "This place is reserved for destiny." You stand.', 0),
  ('A philosopher at the door proves the next station does not exist. The train disagrees.', -3),
  ('Signal failure caused by two cats fighting on the cable. Dispatch is involved.', -4),
  ('A stranger hands you exact change for no reason and vanishes into the crowd. That was rich.', 2),
  ('The escalator runs backwards but you walk up looking very determined. One step forward, two step backwards.', -1),
  ('The ticket machine whispers "my destiny" as you tap your card. You feel seen.', 1),
  ('A man has been sitting in this carriage since 1987. He shares his simit with you.', 1),
  ('A passenger mistakes you for a metro official and clears the entire carriage for you.', 3),
  ('The whole carriage falls silent. No one knows why. You gain inner peace.', 0),
  ('A street musician boards and plays so well that you tip everything you have.', -3),
  ('The PA system announces your name specifically. Everyone applauds. You feel unstoppable.', 4);

INSERT INTO users (username, hashedPassword, salt) VALUES
  ('barca',
   'e56ffbab1c3dc838d1123c0d349ab1c59aa9ed268f6aa77b03c89726fce47b53',
   'c8d4666f5ccf5c7fdd79a454c5182436'),
  ('nilay',
   '94e08676a2eec389a7985d2ff47922c23785d70726e8f6f07a7c5ac0fb51753c',
   'b2ce572fa46a75f3a73c7be0f6fd58cb'),
  ('ender',
   'ae1592256f39b3425440f0aef44d3274b8e6204ad642210f6c7ea178d2a9b865',
   '3b63213935ff9eab73096d927c66830a'),
  ('askim',
   '574e8341948fd434d5e19592bc302ccf53d96ebd2a8e889c341ee13213c44cfd',
   '28b39135703431332bbf86dcb3a05fcb'),
  ('deha',
   '4cbf95ea3f8bb482b5ab476135c044dc5796f2621379e2ed8d1461b0aa42493b',
   '63f464bd70cd5f99b4776d41eee8bc6a');

INSERT INTO games (userId, startStationId, destinationStationId, score, status, createdAt) VALUES
  (1, 1,  9,  22, 'completed', '2026-05-20 10:00:00'),
  (1, 4,  10, 18, 'completed', '2026-05-21 14:30:00'),
  (1, 3,  12, 25, 'completed', '2026-05-22 09:15:00'),
  (2, 7,  5,  20, 'completed', '2026-05-20 11:00:00'),
  (2, 1,  9,  15, 'completed', '2026-05-21 16:00:00');