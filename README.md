# RentAI Toronto

AI-powered Toronto rental search platform built with React, Node.js, MongoDB, Docker, and Azure deployment.

---

# Live Demo

🌐 Frontend Deployment:  
https://mango-glacier-04c0df610.7.azurestaticapps.net/

---

# Overview

RentAI is a full-stack rental platform designed to help users discover Toronto rental listings through smart filtering, AI-generated rental insights, interactive maps, and detailed property analytics.

The project combines modern frontend UI/UX with backend APIs, MongoDB data management, Docker containerization, and Azure cloud deployment.

---

# Features

## Rental Search & Filtering
- Search by neighbourhood, price, bedrooms, and bathrooms
- Smart filtering system
- Pagination support
- Dynamic listing results

## Interactive Maps
- Leaflet-powered interactive map
- Accurate neighbourhood-based property coordinates
- Property popup previews
- Fullscreen map mode
- Direct navigation from map popup to listing page

## AI Rental Insights
- AI-generated listing recommendations
- Rental value analysis
- Transit convenience evaluation
- Personalized rental summaries

## Listing Details
- Detailed property pages
- Property image galleries
- Amenities overview
- Similar listings nearby
- Price intelligence section
- Landlord contact information

## Saved Listings
- Bookmark favorite listings
- Local storage persistence

## Deployment & DevOps
- Dockerized frontend and backend
- Azure Static Web App deployment
- GitHub Actions CI/CD integration

---

# Tech Stack

## Frontend
- React
- React Router
- Axios
- Leaflet / React-Leaflet
- CSS

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## Data & Utilities
- Python
- Faker
- Synthetic rental dataset generation

## DevOps & Cloud
- Docker
- Docker Compose
- Azure Static Web Apps
- GitHub Actions

---

# Project Structure

```bash
rentAI/
│
├── frontend/
├── backend/
├── data-pipeline/
├── docker/
├── .github/
```

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/mehmet-akif/rentai.git
cd rentai
```

---

# Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```bash
http://localhost:5001
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Docker Setup

## Build Containers

### Backend

```bash
cd backend
docker build -t rentai-backend .
```

### Frontend

```bash
cd frontend
docker build -t rentai-frontend .
```

---

## Run Containers

### Backend

```bash
docker run -p 5001:5001 --env-file .env rentai-backend
```

### Frontend

```bash
docker run -p 5173:80 rentai-frontend
```

---

# Environment Variables

## Backend `.env`

```env
MONGO_URI=your_mongodb_connection
PORT=5001
```

---

# Screenshots

Add screenshots here later:

- Homepage
- Listings page
- Interactive map
- Listing details
- AI rental insights

---

# Future Improvements

- User authentication
- Rental posting dashboard
- Recommendation engine improvements
- Backend cloud deployment
- Advanced analytics dashboard
- Real rental API integration

---

# Author

Mehmet Akif  
Final-year Computer Science student at Toronto Metropolitan University

GitHub:  
https://github.com/mehmet-akif
