const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const path = require("path");

// Bruk tjenestenøkkel fra Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Lagre ny samling
app.post("/collections", async (req, res) => {
  const { links } = req.body;
  if (!Array.isArray(links)) {
    return res.status(400).json({ error: "Links must be an array." });
  }

  const id = uuidv4();
  await db.collection("collections").doc(id).set({ links });
  res.json({ id });
});

// Hent samling
app.get("/collections/:id", async (req, res) => {
  const doc = await db.collection("collections").doc(req.params.id).get();
  if (!doc.exists) {
    return res.status(404).json({ error: "Collection not found." });
  }
  res.json(doc.data());
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});