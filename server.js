const express = require("express");
const fs = require("fs");
const path = require("path");


// Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Existing notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read notes' });
        return;
      }
      const notes = JSON.parse(data);
      res.json(notes);
    });
  });  

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
