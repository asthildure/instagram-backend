
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "collections.json";

app.use(cors());
app.use(express.json());

const loadData = () => {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.post("/collections", (req, res) => {
  const { links } = req.body;
  if (!Array.isArray(links)) {
    return res.status(400).json({ error: "Links must be an array." });
  }
  const id = uuidv4();
  const data = loadData();
  data[id] = links;
  saveData(data);
  res.json({ id });
});

app.get("/collections/:id", (req, res) => {
  const data = loadData();
  const collection = data[req.params.id];
  if (!collection) {
    return res.status(404).json({ error: "Collection not found." });
  }
  res.json({ links: collection });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
