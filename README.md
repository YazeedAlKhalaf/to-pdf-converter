# File to PDF Converter

Convert various file formats to PDF easily. Supports:

- Office documents (DOC, DOCX, PPT, PPTX, XLS, XLSX)
- Images (JPG, PNG, GIF)
- Text files (TXT, MD)

## Quick Start

1. Install Docker and Docker Compose on your system
2. Clone this repository
3. Run:

```bash
docker-compose up --build
```

4. Open http://localhost:3000 in your browser

That's it! The converter is ready to use.

## Usage

1. Drag and drop files or click to select them
2. Click "Convert to PDF"
3. Download your converted PDFs

## Configuration

- Maximum file size can be adjusted in docker-compose.yml
- Default port is 3000, can be changed in docker-compose.yml

## File Storage

Temporary files are stored in ./uploads directory and automatically cleaned up after conversion.
