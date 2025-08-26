const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Connect to SQLite database
const db = new sqlite3.Database('./mlhub.db', (err) => {
  if (err) console.error("DB Connection Error:", err.message);
  else console.log("Connected to SQLite database");
});

// =======================
// Create tables if not exist
// =======================
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER,
    title TEXT,
    url TEXT,
    type TEXT,
    FOREIGN KEY(topic_id) REFERENCES topics(id)
  )`);
});

// =======================
// Get all topics
// =======================
app.get('/api/topics', (req, res) => {
  db.all('SELECT * FROM topics', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// =======================
// Create new topic
// =======================
app.post('/api/topics', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Topic name required" });

  db.run('INSERT INTO topics(name) VALUES(?)', [name], function(err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        // Topic already exists
        db.get('SELECT * FROM topics WHERE name=?', [name], (err2, row) => {
          if (err2) res.status(500).json({ error: err2.message });
          else res.json(row);
        });
      } else {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.json({ id: this.lastID, name });
    }
  });
});

// =======================
// Get resources by topic_id
// =======================
app.get('/api/resources', (req, res) => {
  const topic_id = req.query.topic;
  if (!topic_id) return res.status(400).json({ error: "Topic ID required" });

  db.all('SELECT * FROM resources WHERE topic_id=?', [topic_id], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// =======================
// Search resources
// =======================
app.get('/api/search', (req, res) => {
  const q = '%' + req.query.query + '%';
  db.all('SELECT * FROM resources WHERE title LIKE ?', [q], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// =======================
// Add new resource
// =======================
app.post('/api/resources', (req, res) => {
  const { topic_id, title, url, type } = req.body;

  if (!topic_id || !title || !url || !type) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.run(
    'INSERT INTO resources (topic_id, title, url, type) VALUES (?, ?, ?, ?)',
    [topic_id, title, url, type],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, topic_id, title, url, type });
    }
  );
});


// =======================
// Start server
// =======================
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
