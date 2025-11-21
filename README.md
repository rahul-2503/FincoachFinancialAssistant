 
Fincoach Financial Assistant

A full-stack personal finance assistant built using MongoDB, FastAPI (Python), and React.
This guide explains how to run the entire project locally.

 How to Run the Project
1️ Start MongoDB Server

Make sure MongoDB is installed.
Run this command in CMD/PowerShell:

"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"

2️ Start the Backend (FastAPI)

Navigate to the backend folder:

cd backend


Run the server:

uvicorn backend.main:app --reload


Backend will start at:

http://127.0.0.1:8000

3️ Start the Frontend (React)

Navigate to the frontend folder:

cd frontend


Run the development server:

npm run dev


Frontend will start at:

http://localhost:5173

Tech Stack

Frontend: React + Vite

Backend: FastAPI (Python)

Database: MongoDB

Package Manager: npm
