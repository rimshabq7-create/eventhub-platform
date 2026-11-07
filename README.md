EventHub - Event Discovery & Community Engagement Platform

Student: Rimsha
Group ID: S26PROJECT3522B
Supervisor: Amjad Iqbal Khan
Course: CS619 - Final Project

1. Project Overview

EventHub is a full-stack web application that allows users to discover, explore, and engage with local events.

It provides an interactive map, real-time search, dynamic filtering, event details, and personalized user dashboards to enhance the event discovery experience.

2. Technology Stack

Frontend:

Next.js 16

React

Tailwind CSS v4

Leaflet.js (Interactive Map)

Backend:

Strapi v5 (Headless CMS)

Database:

SQLite (Development)

PostgreSQL (Production Ready)

Authentication:

localState (Demo Authentication for Prototype)

3. Features Implemented

Interactive Map using Leaflet.js

Event Discovery with List and Grid Views

Real-Time Search

Category-Based Filtering

Event Details Page (Date, Venue, Price, and Map)

User Authentication (Login, Register, and Logout)

User Dashboard

Real-Time RSVP Tracking

Bookmark System

Database-Connected RSVP and Bookmarks

Reviews System with Database Integration

Fully Responsive Design

Modern Navy Blue and Orange Theme

4. Prerequisites

Before running the project, make sure you have installed:

Node.js v22 or later

npm (Node Package Manager)

5. How to Run Locally

Follow these steps to run the application on your local machine.

Step 1: Start the Backend (Strapi)

Open a terminal in VS Code and execute:

cd backend
npm install
npm run develop

The backend server will start at:

http://localhost:1337

Step 2: Start the Frontend (Next.js)

Open a new terminal in VS Code and execute:

cd frontend
npm install
npm run dev

The frontend application will start at:

http://localhost:3000

Open the frontend URL in your browser to access EventHub.

6. Demo Credentials

Use the following credentials to access the demo application:

Admin Email:

admin@eventhub.com

Admin Password:

Admin@12345

You can also register a new account directly through the application.

Note: These are prototype demo credentials. Do not use them in a production environment.

7. Supervisor Notes

The application uses Strapi v5 as the backend Headless CMS.

Events and Categories are managed through the backend.

RSVPs, Bookmarks, and Reviews are integrated with database storage.

The frontend is fully responsive and developed using Tailwind CSS.

Leaflet.js provides interactive map functionality.

The project demonstrates full-stack web development and database integration.

8. Project Submission

There are two possible approaches for project submission.

Option A: Submit Source Code Locally

Create a ZIP archive containing the backend and frontend folders.

Exclude node_modules folders to reduce file size.

Include this README.md file.

Include relevant application screenshots.

Option B: Deploy the Application Online (Recommended)

Deploy the application to make it accessible through a live URL.

Recommended Deployment Platforms:

Frontend: Vercel

Backend: Railway

Database: PostgreSQL

Benefits of Deployment:

Provides a live application URL.

Allows the supervisor to test the application online.

Makes project demonstration easier.

Showcases practical deployment experience.

EventHub

Discover Events. Connect with Communities.

Developed as part of the CS619 Final Year Project.