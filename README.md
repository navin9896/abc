# Flashcard Generator

A full-stack application for generating flashcards using AI. The application consists of a React frontend and a FastAPI backend.

## Prerequisites

Before running this project, make sure you have the following installed:

- Python 3.7 or higher
- Node.js and npm
- Git

## Project Structure

```
AIML/
├── backend/         # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── frontend/        # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```powershell
   python -m uvicorn main:app --reload
   ```
   The backend will run on http://localhost:8000

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install Node.js dependencies:
   ```powershell
   npm install
   ```

3. Start the frontend development server:
   ```powershell
   npm start
   ```
   The frontend will run on http://localhost:3000

## Technologies Used

### Frontend
- React.js
- Material-UI (@mui/material)
- Axios for API calls
- File-saver for file handling

### Backend
- Python with FastAPI
- Uvicorn (ASGI server)
- OpenAI integration
- Python-dotenv for environment variables

## Troubleshooting

1. If you get a "uvicorn not found" error:
   - Make sure you've installed the requirements.txt file
   - Try using `python -m uvicorn main:app --reload` instead of just `uvicorn`

2. If you get npm errors:
   - Make sure you're in the correct directory (frontend folder)
   - Try deleting the node_modules folder and running `npm install` again

3. If the frontend can't connect to the backend:
   - Ensure both servers are running
   - Check that the backend is running on port 8000
   - Verify that the frontend is running on port 3000

## Environment Variables

The backend might require environment variables for the OpenAI integration. Check if there's a `.env` file in the backend directory and set up the required variables.

## Contributing

Feel free to submit issues and enhancement requests!
