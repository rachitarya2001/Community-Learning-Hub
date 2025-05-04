📚 Community Learning Hub

A full-stack web application where users can explore educational content aggregated from Twitter, Reddit, and LinkedIn, earn credit points for engagement, and interact through a clean, user-friendly dashboard.

🚀 Features

👤 User Authentication

Register and Login using JWT tokens

Role-based access for Users and Admins

🎯 Credit Points System

Earn 5 points for:

Saving a feed

Reporting a feed

Sharing a feed

Track transactions with type, purpose, and timestamp

Points are stored in MongoDB

📰 Feed Aggregator

Sources:

Twitter (15-minute interval limit)

Reddit (latest/top/hot posts from r/learnprogramming)

Mock LinkedIn feeds

Each feed card displays:

Title, Source, Preview

Save / Report / Share buttons

🛠 Admin Dashboard

View all registered users

Review reported feeds with report reasons

Delete inappropriate content

View saved and shared feeds

💻 Tech Stack

Frontend: React.js, React-Bootstrap, Axios, Toastify

Backend: Express.js, Node.js, JWT Auth, Mongoose

Database: MongoDB (Atlas or Local)

Deployment Options: Firebase (frontend), GCP or Render (backend)

Instructions to Run Locally

1. Clone the Repository

git clone https://github.com/rachitarya2001/Community-Learning-Hub

2. Setup Backend

cd backend
npm install

Create a .env file in backend folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/communityhub
JWT_SECRET=your_jwt_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

Run Backend:
npm start

3. Setup Frontend

cd frontend
npm install
npm start

App will start on: http://localhost:3000

4. Vercel Link

https://community-learning-hub-pifa.vercel.app/

🧑‍💻 Admin Access

Use this pre-created account:

Email: admin@example.com
Password: admin123

If missing, create one using MongoDB Shell:

use communityhub

const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash("admin123", 10);



// Then insert:
db.users.insertOne({
name: "Admin User",
email: "admin@example.com",
password: hash,
role: "admin",
credits: 0,
createdAt: new Date(),
updatedAt: new Date()
})
