# Claude AI Generator

A responsive AI text generator prototype built with React, Node.js, and Express.

## Features

- Clean, responsive user interface
- Prompt input with character counter
- Generate button with loading state
- Mock AI response through a REST API
- Copy generated response
- Input validation and error handling

## Tech Stack

- React
- Vite
- Node.js
- Express
- CSS
- Lucide React

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/cediepambid/claude-ai-generator.git
cd claude-ai-generator
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs at `http://localhost:3001`.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## API Endpoints

- `GET /api/health` — Check backend status.
- `POST /api/generate` — Generate a mock response from a prompt.

## Current Status

This project currently uses a mock response. Claude API integration and production deployment are not yet configured.

## Security

Never commit API keys or `.env` files. Store secrets in environment variables on the backend.
