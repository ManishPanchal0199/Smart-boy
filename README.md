# SMART-BOY 🧠

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-stable-success.svg)

**SMART-BOY** is a high-performance, client-side AI research assistant designed to democratize access to complex information. It mimics the core functionality of tools like NotebookLM but operates with a lightweight, privacy-focused architecture.

This application bridges the gap between static content (PDFs) and dynamic multimedia (YouTube) by leveraging **Google's Gemini 2.5 Flash** model for high-speed "In-Context Retrieval Augmented Generation" (RAG).

![Home Screen](./screenshots/home_preview.png)

## 🚀 Key Features

### 1. 📄 PDF Q&A Assistant (Client-Side RAG)
Instead of relying on heavy vector databases, SMART-BOY utilizes a **document-sharding approach**:
*   **Zero-Server Upload**: PDFs are processed entirely in the browser using `pdf.js` workers.
*   **Context-Aware Citing**: The AI cites specific page numbers `[Page X]` for every claim.
*   **Rich Markdown Rendering**: Responses are formatted with distinct visual hierarchies.

### 2. 📹 YouTube Video Notes Generator
Transforms passive video consumption into active learning:
*   **Deep Summarization**: extracts executive summaries, key concepts, and actionable takeaways.
*   **Grounding**: Uses Google Search grounding to verify video content against external sources.
*   **Structured Output**: Generates a clean, study-guide style card for every video.

## 🛠 Tech Stack

*   **Frontend**: React 19 (ES Modules), TypeScript
*   **Styling**: Tailwind CSS (Utility-first architecture)
*   **AI Engine**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
*   **PDF Processing**: Mozilla PDF.js (Web Workers)
*   **State Management**: React Hooks

## 📸 Screenshots

| Home Dashboard | PDF Chat Interface |
|:---:|:---:|
| ![Home](./screenshots/home.png) | ![PDF Chat](./screenshots/pdf_chat.png) |

| Video Analysis | Glassmorphism UI |
|:---:|:---:|
| ![Video Notes](./screenshots/video_notes.png) | ![UI Detail](./screenshots/ui_detail.png) |

## ⚡ Quick Start

### Prerequisites
*   Node.js (v18+) or Docker
*   A Google Gemini API Key

### Method 1: Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/smart-boy.git
    cd smart-boy
    ```

2.  **Serve the application**
    Since this project uses ES Modules and CDNs, you can serve it with any static file server.
    
    ```bash
    npx serve .
    ```

    *Note: Ensure your environment injects `process.env.API_KEY` or replace it in `services/geminiService.ts` for local testing.*

### Method 2: Docker (Recommended)

Run the application in an isolated container.

1.  **Build the image**
    ```bash
    docker build -t smart-boy .
    ```

2.  **Run the container**
    ```bash
    docker run -p 8080:80 -e API_KEY="your_actual_api_key_here" smart-boy
    ```

3.  Access via `http://localhost:8080`

## 🐳 Docker Deployment

The included `Dockerfile` utilizes a multi-stage build (if necessary) or a lightweight **Nginx Alpine** image to serve the static assets with maximum performance.

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

## 🤝 Contributing

Contributions are welcome! Please read the contribution guidelines first.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by Manish
