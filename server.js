// Add Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util")

// Handle Asynchronous Processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Set up the Server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Static Middleware
app.use(express.static('./develop/public'));

// ===== API ROUTES =====
//GET Request
app.get('/api/notes', function(req, res) {
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data));
        res.json(notes);
    });
});
//POST Request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
      const notes = [].concat(JSON.parse(data));
      note.id = notes.length + 1
      notes.push(note);
      return notes
    }).then(function(notes) {
      writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
      res.json(note);
    })
});

//DELETE Request
app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
      const notes = [].concat(JSON.parse(data));
      const newNotesData = []
      for (let i = 0; i<notes.length; i++) {
        if(idToDelete !== notes[i].id) {
          newNotesData.push(notes[i])
        }
      }
      return newNotesData
    }).then(function(notes) {
      writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
      res.send('Update Saved Successfully');
    });
  });

 
// Listening
app.listen(PORT, function() {
    console.log(`App listening on Port: ${PORT}`);
});