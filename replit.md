# Prep4U - Free Exam Preparation Platform

## Overview
Prep4U is a free exam preparation platform that allows students to upload their own questions, create custom exams, and track their progress. This is a static web application built with HTML, CSS, and JavaScript with Firebase integration for backend services.

## Project Structure
- **Prep4U/** - Main application directory
  - **assets/** - Images and static assets (logo, favicon)
  - **css/** - Stylesheets
    - style.css - Main application styles with animations
  - **firebase/** - Firebase configuration
    - firebase-config.js - Firebase configuration (needs setup)
  - **js/** - JavaScript files
    - app.js - Main application logic, authentication, UI management
    - firebase.js - Firebase integration for auth, Firestore, and storage
  - **HTML pages:**
    - index.html - Landing page
    - login.html - Login/registration page
    - dashboard.html - Student dashboard
    - upload-questions.html - Question upload interface
    - take-exam.html - Exam taking interface
    - results.html - Exam results display
    - admin-dashboard.html - Admin dashboard
    - about.html - About page
    - contact.html - Contact page

## Technology Stack
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Firebase (Authentication, Firestore, Storage)
- Server: Python HTTP server for static file serving

## Features
- User authentication (Firebase Auth)
- Question upload system (single and bulk upload)
- Custom exam creation
- Timed practice exams
- Progress tracking and analytics
- Responsive design (mobile-friendly)

## Setup Requirements
- Firebase project configuration (optional - app runs in demo mode without Firebase)
- No build process required - pure static files

## Recent Changes
- [2025-01-09] Initial import from GitHub
- [2025-01-09] Configured for Replit environment with Python HTTP server
