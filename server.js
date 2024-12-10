const express = require("express");
const bodyParser = require("body-parser");
const { execFile } = require("child_process");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable requests from the extension

const AUDIO_FILE = "output.mp3";

app.post("/synthesize", (req, res) => {
  const { text, voice = "en-US-JennyNeural", format = "audio-16khz-32kbitrate-mp3" } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided." });
  }

  const pythonScript = "synthesize.py"; // Path to the Python script
  const args = [text, voice, format];

  execFile("python", [pythonScript, ...args], (error, stdout, stderr) => {
    if (error) {
      console.error("Python script error:", stderr);
      return res.status(500).json({ error: "TTS generation failed." });
    }

    // Ensure the audio file exists
    if (!fs.existsSync(AUDIO_FILE)) {
      return res.status(500).json({ error: "Audio file not found." });
    }

    res.json({ audio_url: `http://localhost:5000/${AUDIO_FILE}` });
  });
});

app.use(express.static(".")); // Serve static files (e.g., audio)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node.js server running at http://localhost:${PORT}`);
});
