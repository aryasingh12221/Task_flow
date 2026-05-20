<div align="center">
  <img src="https://img.icons8.com/color/96/000000/task--v1.png" alt="TaskFlow Logo" width="80" height="80"/>
  <h1>TaskFlow</h1>
  <p>A Modern, Jira-Inspired Project & Issue Tracking Platform</p>
  
  <p>
    <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
    <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot 3.2" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL 8" />
  </p>
</div>

<hr/>

## 🚀 Overview

**TaskFlow** is a comprehensive, full-stack application designed to streamline agile project management. Built with a robust **Java/Spring Boot** backend and a highly responsive **React/Vite** frontend, it provides teams with an intuitive Kanban-style interface to manage tasks, bugs, and stories seamlessly.

## ✨ Features

- **Secure Authentication**: Robust JWT-based signup and login functionality.
- **Project Workspaces**: Create custom projects with auto-generated identifiers (e.g., `TF`).
- **Issue Tracking**: Define, assign, and track issues categorised as `Task`, `Bug`, or `Story`.
- **Kanban Board**: Drag-and-drop enabled interface with a sleek, Jira-style dark theme.
- **Team Management**: Role-based access control (RBAC) to manage project members securely.
- **Analytics Dashboard**: Real-time insights and tracking for overdue tasks.

## 🛠️ Technology Stack

| Architecture | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2, Spring Security (JWT), Hibernate/JPA |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Axios |
| **Database** | MySQL 8 |
| **Deployment** | Railway |

## 🏗️ Local Development Setup

### Prerequisites
- [JDK 21](https://jdk.java.net/21/)
- [Node.js 20+](https://nodejs.org/)
- [MySQL 8](https://dev.mysql.com/downloads/mysql/)

### 1. Database Configuration
Create the required database in your local MySQL instance:
```sql
CREATE DATABASE taskflow;
```

Update your database credentials in the backend:
`taskflow-backend/src/main/resources/application-local.properties`
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 2. Backend Initialization
Navigate to the backend directory and run the Spring Boot application using the local profile:
```bash
cd taskflow-backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```
*(The backend will be available at `http://localhost:8080`)*

### 3. Frontend Initialization
In a separate terminal, navigate to the frontend directory, install dependencies, and start the Vite dev server:
```bash
cd taskflow-frontend
npm install
npm run dev
```
*(The frontend will be available at `http://localhost:5173`)*

## 🌐 API Reference

### Authentication
* `POST /api/auth/signup` - Register a new user
* `POST /api/auth/login` - Authenticate and retrieve JWT

### Projects
* `GET /api/projects` - List all accessible projects
* `POST /api/projects` - Create a new project
* `GET /api/projects/{id}` - Fetch project details
* `DELETE /api/projects/{id}` - Delete project

### Members & Issues
* `POST /api/projects/{id}/members` - Add a member to a project
* `DELETE /api/projects/{id}/members/{userId}` - Remove a member
* `GET /api/projects/{projectId}/issues` - List all issues in a project
* `POST /api/projects/{projectId}/issues` - Create a new issue
* `PATCH /api/issues/{id}` - Update an existing issue

## ☁️ Deployment Guide (Railway)

1. Connect your GitHub repository to [Railway](https://railway.app/).
2. Provision a **MySQL Plugin** instance on Railway.
3. Deploy the `taskflow-backend` and configure the following environment variables:
   - `MYSQL_URL`, `MYSQLUSER`, `MYSQLPASSWORD`
   - `JWT_SECRET`, `PORT`
4. Deploy the `taskflow-frontend` as a static site. Add `VITE_API_URL` pointing to your deployed backend's URL.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
