const express = require("express");
const fs = require("fs");
const path = require("path");

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// Existing notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read notes' });
        return;
      }
      const notes = JSON.parse(data);
      res.json(notes);
    });
  });
  

// 404 error route
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/404.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
