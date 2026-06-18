# SkillForge

SkillForge is a full-stack developer profile management platform that allows users to create accounts, manage profiles, skills, and education details using secure JWT authentication.

## Features

* User Registration
* User Login
* JWT Authentication
* Persistent Login using Zustand
* Protected Backend Routes
* Profile Management
* Skills Management
* Education Management
* MongoDB Data Storage
* REST API Architecture

## Tech Stack

### Frontend

* React
* TypeScript
* React Router DOM
* Axios
* Zustand
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## Project Structure

```text
SkillForge
├── client
│   ├── src
│   └── public
│
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── config
│   └── package.json
```

## Installation

### Clone Repository

```bash
git clone https://github.com/ashutosh-shahi/SkillForge.git
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### User

```http
GET /api/users/profile
PUT /api/users/profile
```

## Current Features

* User Registration
* User Login
* JWT Authentication
* Persistent Login Sessions
* Profile Viewing
* Profile Editing
* Skills Management
* Education Management

## Upcoming Features

* Project Management
* Project Showcase Section
* Avatar Upload
* Public Profiles
* Search Users
* Responsive UI Improvements
* Dark Mode

## Author

Ashutosh Shahi
B.Tech, Electrical Engineering
MANIT Bhopal
