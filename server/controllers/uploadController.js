const Notes = require("../models/Note");

// Upload a new note
const uploadNote = async (req, res) => {
  try {
    const { semester, subject, category } = req.body;
    const file = req.file;

    if (!semester || !subject || !category || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const note = new Notes({
      semester,
      subject,
      category,
      filename: file.originalname,
      filetype: file.mimetype,
      data: file.buffer,
    });

    await note.save();
    res.status(200).json({ message: "✅ File uploaded successfully!" });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "❌ Server error during upload." });
  }
};

// Get all notes organized by semester, subject, category
const getAllNotes = async (req, res) => {
  try {
    const notes = await Notes.find();

    const structured = {};

    notes.forEach(note => {
      const { semester, subject, category, _id, filename } = note;

      if (!structured[semester]) structured[semester] = {};
      if (!structured[semester][subject]) structured[semester][subject] = {};
      if (!structured[semester][subject][category]) structured[semester][subject][category] = [];

      structured[semester][subject][category].push({
        id: _id,
        filename,
        url: `http://localhost:5000/api/upload/file/${_id}`, // for opening in new tab
      });
    });

    res.json(structured);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "❌ Error fetching notes." });
  }
};

// Serve file for view/download
const getNoteFile = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("File not found");

    res.set({
      "Content-Type": note.filetype,
      "Content-Disposition": `inline; filename="${note.filename}"`,
    });
    res.send(note.data);
  } catch (err) {
    res.status(500).send("❌ Error serving file");
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  try {
    const note = await Notes.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "🗑️ Note deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "❌ Error deleting note" });
  }
};

module.exports = {
  uploadNote,
  getAllNotes,
  getNoteFile,
  deleteNote,
};
