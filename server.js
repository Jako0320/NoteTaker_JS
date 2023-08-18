const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(express.json());

// Homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Existing notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to read notes" });
      return;
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Add a note to the existing ones
app.post("/api/notes", (req, res) => {
  const existingNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };
  existingNotes.push(newNote);
  fs.writeFileSync(
    "./db/db.json",
    JSON.stringify(existingNotes, null, 2),
    "utf8"
  );

  res.json(newNote);
});

// Delete a saved note
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const existingNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const noteIndex = existingNotes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    existingNotes.splice(noteIndex, 1);
    fs.writeFileSync(
      "./db/db.json",
      JSON.stringify(existingNotes, null, 2),
      "utf8"
    );
    res.status(200).json({ message: "Note deleted successfully" });
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
