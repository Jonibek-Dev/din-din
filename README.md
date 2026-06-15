# din-din AI Chat Platform ✨

**din-din** is a professional, minimalist AI chat platform powered by [Groq](https://groq.com/). It features a clean, iOS-inspired light-mode interface, robust Markdown support, and multi-chat capabilities, all designed to provide a magical and efficient user experience.

![React](https://img.shields.io/badge/frontend-React%20%2B%20TS-61dafb.svg)
![Node.js](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933.svg)
![Groq](https://img.shields.io/badge/AI-Groq%20Cloud-orange.svg)

## 🧚 Features

- **Minimalist iOS Design:** A clean, Telegram-inspired light-mode interface focused on clarity and typography.
- **Lightning Fast AI:** Powered by Groq's LPUs for near-instantaneous responses.
- **Multi-Model Support:** Choose between specialized "din-din" branded models:
  - 🌟 **din-din Pro** (Llama 3.3 70B) - For complex reasoning and high-level tasks.
  - ⚡ **din-din Mini** (Llama 3 8B) - For quick answers and efficiency.
  - 🚀 **din-din Turbo** (Mixtral 8x7B) - For balanced performance and logic.
  - 🍃 **din-din Lite** (Gemma 2 9B) - For light conversations.
- **Markdown Ready:** Full support for code blocks, formatting, and mathematical notations.
- **Session Management:** Create, rename, and delete multiple chat sessions (stored locally).
- **Branded Experience:** Inspired by the magical spirit of Tinkerbell, with a custom-themed interface.

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript), Vite, Lucide React, React-Markdown.
- **Backend:** Node.js, Express, Groq SDK, Dotenv.
- **Styling:** Vanilla CSS (Minimalist approach).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Groq API Key](https://console.groq.com/keys)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jonibek-dev/din-din.git
   cd din-din
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

Visit `http://localhost:port in your browser to start chatting!

## 📸 Screenshots

![image](https://github.com/Jonibek-Dev/din-din/blob/main/image.png)

---
*Created with ✨ by din-din*
