const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  filename: String,
  filetype: String,
  data: String, // path to uploaded file
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
