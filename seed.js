const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./mlhub.db");

const topics = [
  { id: 1, name: "Regression", unit: 1 },
  { id: 2, name: "Classification", unit: 2 },
  { id: 3, name: "Machine Learning", unit: 3 },
  { id: 4, name: "Neural Networks", unit: 4 },
  { id: 5, name: "Reinforcement Learning", unit: 5 },
  { id: 6, name: "Data in Machine Learning", unit: 6 },
  { id: 7, name: "Unsupervised Learning", unit: 7 }
];

const resources = [
  { topic_id: 1, title: "Regression PDF", pdfLink: "https://drive.google.com/file/d/1lxobsbTQiTLyW9HpFSvuioOkWuBGo88g/view?usp=sharing", videoLink: "https://www.youtube.com/watch?v=PaFPbb66DxQ" },
  { topic_id: 2, title: "Classification PDF", pdfLink: "https://drive.google.com/file/d/1eJg0vlwYmHxVRjK5CRkUCW-m0Mhq0mpC/view?usp=drive_link", videoLink: "https://www.youtube.com/watch?v=wvOaJ6mQ-9k" },
  { topic_id: 3, title: "Machine Learning PDF", pdfLink: "https://drive.google.com/file/d/1SxBZopVgMiHNTDDgeUME13EUwDATXbX6/view?usp=drive_link", videoLink: "https://www.youtube.com/watch?v=GwIo3gDZCVQ" },
  { topic_id: 4, title: "Neural Networks PDF", pdfLink: "https://drive.google.com/file/d/1rY1zR9aqvgg-c5eXhrJS6wsOtfipshmI/view?usp=drive_link", videoLink: "https://www.youtube.com/watch?v=aircAruvnKk" },
  { topic_id: 5, title: "Reinforcement Learning PDF", pdfLink: "https://drive.google.com/file/d/17JAQULeg2v-evdMtmmLzI6vTvm1Pxx-9/view?usp=drive_link", videoLink: "https://www.youtube.com/watch?v=2pWv7GOvuf0" },
  { topic_id: 6, title: "Data in ML PDF", pdfLink: "https://drive.google.com/file/d/1pd09gVBFSciU8Q9n8qNQ-BsC1baEhqRm/view", videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { topic_id: 7, title: "Unsupervised Learning PDF", pdfLink: "https://drive.google.com/file/d/1KfXgzi5sFKzUnFwsa0KhQukblsWS2qDE/view", videoLink: "https://www.youtube.com/watch?v=4b5d3muPQmA" }
];

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS resources");
  db.run("DROP TABLE IF EXISTS topics");

  db.run(`
    CREATE TABLE topics (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      unit INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER,
      title TEXT NOT NULL,
      pdfLink TEXT,
      videoLink TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics (id)
    )
  `);

  const insertTopic = db.prepare("INSERT INTO topics (id, name, unit) VALUES (?, ?, ?)");
  topics.forEach(t => {
    insertTopic.run(t.id, t.name, t.unit);
  });
  insertTopic.finalize();

  const insertResource = db.prepare("INSERT INTO resources (topic_id, title, pdfLink, videoLink) VALUES (?, ?, ?, ?)");
  resources.forEach(r => {
    insertResource.run(r.topic_id, r.title, r.pdfLink, r.videoLink);
  });
  insertResource.finalize();

  db.all("SELECT * FROM topics", (err, rows) => {
    console.log("📌 Topics in DB:", rows);
    db.close();
  });
});
