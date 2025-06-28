// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Note = require("../models/Note");

const router = express.Router();

// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ POST: Upload a Note
router.post("/", upload.single("note"), async (req, res) => {
  try {
    const { semester, subject, category } = req.body;
    const file = req.file;

    if (!semester || !subject || !category || !file) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newNote = new Note({
      semester,
      subject,
      category,
      filename: file.originalname,
      filetype: file.mimetype,
      data: file.path,
    });

    await newNote.save();
    res.status(200).json({ message: "✅ Note uploaded successfully!" });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "❌ Upload failed" });
  }
});

// ✅ GET: All Notes (structured)
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    const structured = {};

    notes.forEach(note => {
      const { _id, semester, subject, category, filename } = note;
      if (!structured[semester]) structured[semester] = {};
      if (!structured[semester][subject]) structured[semester][subject] = {};
      if (!structured[semester][subject][category]) structured[semester][subject][category] = [];

      structured[semester][subject][category].push({
        id: _id,
        filename,
        url: `http://localhost:5000/api/upload/file/${_id}`, // 👈 fixed: use ID, not filename
      });
    });

    res.status(200).json(structured);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "❌ Failed to fetch notes" });
  }
});

// ✅ GET: Serve File by MongoDB _id
router.get("/file/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // 🛡️ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("❌ Invalid file ID");
    }

    const note = await Note.findById(id);
    if (!note) return res.status(404).send("❌ File not found");

    const filePath = path.resolve(note.data);
    if (!fs.existsSync(filePath)) return res.status(404).send("❌ File missing on server");

    res.set({
      "Content-Type": note.filetype,
      "Content-Disposition": `inline; filename="${note.filename}"`,
    });

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error("File Serve Error:", err);
    res.status(500).send("❌ Error serving file");
  }
});

// ✅ DELETE: Delete note by _id
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const filePath = path.resolve(note.data);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: "🗑️ Note deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "❌ Error deleting note" });
  }
});

module.exports = router;
