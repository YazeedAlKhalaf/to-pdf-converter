// server.js
import express from "express";
import multer from "multer";
import { execSync } from "child_process";
import libre from "libreoffice-convert";
import { promisify } from "util";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });
const convertAsync = promisify(libre.convert);

// Serve static files (our index.html)
app.use(express.static("public"));

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = inputPath + ".pdf";
    const ext = path.extname(req.file.originalname).toLowerCase();

    switch (ext) {
      case ".docx":
      case ".doc":
      case ".pptx":
      case ".ppt":
      case ".xlsx":
      case ".xls": {
        const docxBuf = fs.readFileSync(inputPath);
        const pdfBuf = await convertAsync(docxBuf, ".pdf", undefined);
        fs.writeFileSync(outputPath, pdfBuf);
        break;
      }

      case ".jpg":
      case ".jpeg":
      case ".png":
      case ".gif":
        await sharp(inputPath).pdf({ quality: 100 }).toFile(outputPath);
        break;

      case ".txt":
      case ".md":
        const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                        <body style="font-family: Arial; padding: 40px;">
                            <pre>${fs.readFileSync(inputPath, "utf8")}</pre>
                        </body>
                    </html>`;
        const htmlPath = inputPath + ".html";
        fs.writeFileSync(htmlPath, htmlContent);
        execSync(`wkhtmltopdf ${htmlPath} ${outputPath}`);
        fs.unlinkSync(htmlPath);
        break;

      default:
        throw new Error("Unsupported file type");
    }

    res.download(outputPath, req.file.originalname + ".pdf", () => {
      // Cleanup after sending
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
