<div align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=openai&logoColor=white" alt="Groq AI" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT Security" />
</div>

<br />

<div align="center">
  <h1 align="center">AI-Powered Mentorship Hub & Academic Portal</h1>
  <p align="center">
    A production-grade, full-stack educational platform featuring an intelligent AI teaching assistant, multi-role dashboards (Teacher, Student, Admin), and a stunning glassmorphic UI.
  </p>
</div>

---

## 🌟 Overview

The AI-Powered Mentorship Hub is a comprehensive Learning Management System (LMS) designed for the modern educational era. Moving beyond traditional student portals, this platform integrates real-time AI capabilities powered by **Groq's 70B Language Models** to provide instant, personalized mentorship to students and automated grading assistance to teachers. 

Built with a robust **Java Spring Boot 3** backend and a lightning-fast **React + Vite** frontend, the application is highly secure, scalable, and beautifully designed using custom glassmorphism aesthetics.

## ✨ Key Features

- 🔐 **Role-Based Access Control (RBAC):** Distinct portals and capabilities for `STUDENT`, `TEACHER`, and `ADMIN` roles, secured by JWT (JSON Web Tokens).
- 🤖 **AI Study Assistant (Groq LLM):** A real-time, conversational AI mentor that helps students with assignments, explains complex topics, and provides personalized study strategies.
- 🎓 **Automated AI Grading:** Teachers can leverage the AI to analyze student submissions, auto-generate scores, and provide detailed, constructive feedback in seconds.
- 📊 **Dynamic Dashboards:** Real-time analytics, attendance tracking charts, and grade distribution metrics mapped directly from the database.
- 🎨 **Premium Glassmorphic UI:** A visually stunning, modern, and responsive user interface utilizing translucent panels, vibrant gradients, and micro-animations.
- 🚀 **Automated Data Seeding:** Intelligent initialization strategy that safely populates dev environments and production databases with demo users and data.

## 🛠️ Technology Stack

### Backend
- **Core:** Java 21, Spring Boot 3.3.1
- **Security:** Spring Security, JWT (Stateless Authentication)
- **Data Access:** Spring Data JPA, Hibernate
- **Database:** PostgreSQL (Production) / H2 In-Memory (Development)
- **AI Integration:** Spring RestClient mapping to Groq API endpoint
- **Build Tool:** Maven

### Frontend
- **Core:** React 18, TypeScript
- **Build Tool:** Vite
- **Styling:** Vanilla CSS3 (Custom Glassmorphism Design System)
- **Icons:** Lucide React
- **Routing:** React Router v6

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- [Java Development Kit (JDK) 21](https://jdk.java.net/21/)
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Maven](https://maven.apache.org/)
- A free API key from [Groq Console](https://console.groq.com/)

### 1. Backend Setup (Spring Boot)
1. Open a terminal and navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Build the project:
   ```bash
   mvn clean install -DskipTests
   ```
3. Set your Groq API key and run the application. (It defaults to the `dev` profile which uses an in-memory H2 database).
   ```bash
   # Windows PowerShell
   $env:APP_GROQ_API_KEY="gsk_your_groq_api_key_here"
   mvn spring-boot:run
   
   # Linux/macOS
   export APP_GROQ_API_KEY="gsk_your_groq_api_key_here"
   mvn spring-boot:run
   ```
   *The server will start on `http://localhost:8080`.*

### 2. Frontend Setup (React/Vite)
1. Open a new terminal and navigate to the `Client` directory:
   ```bash
   cd Client
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file exists in the `Client` root with the following:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The client will start on `http://localhost:5173`.*

### 3. Demo Credentials
Upon startup, the database is automatically seeded. Use these to log in:
- **Teacher:** `teacher` / `teacher123`
- **Student:** `student` / `student123`
- **Admin:** `admin` / `admin123`

## 📄 License
This project is for educational and portfolio purposes.

---