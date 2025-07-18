import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.get("/api/ideas", async (req, res) => {
  try {
    const params = new URLSearchParams();

    if (req.query.page) {
      params.append("page[number]", req.query.page);
    }
    if (req.query.size) {
      params.append("page[size]", req.query.size);
    }
    if (req.query.sort) {
      params.append("sort", req.query.sort);
    }

    if (req.query["append[]"]) {
      const appendValues = Array.isArray(req.query["append[]"])
        ? req.query["append[]"]
        : [req.query["append[]"]];

      appendValues.forEach((value) => {
        params.append("append[]", value);
      });
    }

    const apiUrl = `https://suitmedia-backend.suitdev.com/api/ideas?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch data from external API",
      message: error.message,
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
