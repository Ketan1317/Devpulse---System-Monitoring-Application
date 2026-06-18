# 🚀 DevPulse

> AI-Powered Uptime Monitoring, Incident Management & Website Health Analytics Platform

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.x-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-purple)

---

## 📖 Overview

**DevPulse** is a modern uptime monitoring and observability platform designed to monitor websites, APIs, and services in real time.

The platform continuously performs health checks, detects incidents, calculates uptime statistics, stores historical monitoring data, sends notifications, and leverages **Google Gemini AI** to provide intelligent root-cause analysis and recommendations.

Think of it as a lightweight combination of:

* UptimeRobot
* Better Stack
* Pingdom
* StatusCake

with built-in AI-powered diagnostics.

---

## ✨ Features

### 📡 Monitoring

* HTTP / HTTPS Monitoring
* API Monitoring
* Response Time Tracking
* Health Check Scheduling
* Status Code Tracking
* Historical Monitoring Records

### 🚨 Incident Management

* Automatic Incident Detection
* Open / Resolved Incidents
* Downtime Tracking
* Incident History

### 📊 Analytics

* Uptime Percentage Calculation
* Average Response Time
* Active Incident Metrics
* Dashboard Statistics
* Historical Trends

### 🤖 AI Insights

* AI Health Summaries
* Root Cause Analysis
* Failure Pattern Detection
* Performance Recommendations
* Latency Trend Analysis

### 📧 Notifications

* Incident Open Alerts
* Incident Recovery Alerts
* Email Notifications
* SSL Expiry Alerts

### 🔐 Authentication

* JWT Authentication
* Refresh Tokens
* Google OAuth Login
* GitHub OAuth Login
* Role Based Security

---

# 🏗 System Architecture

```text
                 ┌───────────────┐
                 │ React Frontend│
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Spring Boot   │
                 │ REST API      │
                 └───────┬───────┘
                         │
        ┌────────────────┼───────────────┐
        ▼                ▼               ▼

   MySQL DB       Scheduler Engine   Gemini AI

```

---

# 🛠 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* React Router
* Axios
* ShadCN UI
* Lucide Icons

## Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Spring Scheduler
* Spring AI
* JWT Authentication
* Java Mail Sender

## Database

* MySQL

## AI

* Google Gemini 2.5 Flash

## DevOps

* Docker
* Docker Hub

---

# 📂 Project Structure

## Backend

```text
backend
│
├── Controllers
├── Services
├── Repositories
├── Models
├── DTOs
├── Config
├── Security
├── Scheduler
├── Exceptions
└── Utils
```

---

## Frontend

```text
frontend
│
├── src
│   ├── api
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── hooks
│   ├── routes
│   ├── types
│   ├── utils
│   └── assets
│
└── public
```

---

# 🔑 Environment Variables

Create a `.env` file and configure:

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=

MAIL=
MAIL_PASSWORD=

JWT_SECRET=

API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_SECRET_ID=

GITHUB_CLIENT_ID=
GITHUB_SECRET_ID=
```

---

# ⚙ Spring Configuration

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.mail.username=${MAIL}
spring.mail.password=${MAIL_PASSWORD}

spring.security.jwt.secret=${JWT_SECRET}

spring.ai.google.genai.api-key=${API_KEY}

spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_SECRET_ID}

spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_SECRET_ID}
```

---

# 🐳 Docker Setup

## Backend

### Build

```bash
docker build -t devpulse-backend .
```

### Run

```bash
docker run -p 8080:8080 \
-e DB_URL=your_db_url \
-e DB_USERNAME=root \
-e DB_PASSWORD=password \
-e JWT_SECRET=your_secret \
devpulse-backend
```

---

## Frontend

### Build

```bash
docker build -t devpulse-frontend .
```

### Run

```bash
docker run -p 5173:80 devpulse-frontend
```

---

# 🚀 Local Development

## Backend

```bash
mvn clean install
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8080
```

---

## Frontend

```bash
npm install
npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

---

## User

```http
GET  /api/users/me
PUT  /api/users/me
```

---

## Monitors

```http
GET    /api/monitors
GET    /api/monitors/{id}
POST   /api/monitors
PUT    /api/monitors/{id}
DELETE /api/monitors/{id}
```

---

## Monitor Checks

```http
GET    /api/monitor-checks/{id}
GET    /api/monitor-checks/{id}/history
POST   /api/monitor-checks/{id}/run
```

---

## Dashboard

```http
GET /api/dashboard
```

---

## Incidents

```http
GET /api/incidents
GET /api/incidents/{id}
```

---

## AI Insights

```http
POST /api/ai/monitors/{monitorId}
GET  /api/ai/insights/{monitorId}
```

---

# 📊 Dashboard Metrics

The dashboard provides:

* Total Monitors
* Healthy Monitors
* Down Monitors
* Active Incidents
* Overall Uptime
* Average Response Time
* Recent Checks
* Incident Statistics

---

# 🤖 AI-Powered Insights

DevPulse integrates with **Google Gemini** to analyze monitoring history and generate:

* Service Health Summary
* Root Cause Analysis
* Failure Detection
* Performance Suggestions
* Stability Recommendations

Example:

```json
{
  "summary": "...",
  "possibleCause": "...",
  "recommendation": "..."
}
```

---

# 🔒 Security

* JWT Authentication
* BCrypt Password Encryption
* Refresh Tokens
* OAuth2 Login
* Protected APIs
* CORS Protection
* Secure Cookie Support

---

# 📧 Email Alerts

The system can automatically send:

* Monitor Down Alerts
* Monitor Recovery Alerts
* SSL Expiry Warnings
* Incident Notifications

---

# 📈 Future Enhancements

* Status Pages
* Slack Notifications
* Discord Notifications
* Telegram Alerts
* Team Workspaces
* Custom Domains
* Kubernetes Monitoring
* WebSocket Live Updates

---

# 👨‍💻 Author

**Ketan Goyal**

DevPulse is a full-stack monitoring platform built using Spring Boot, React, MySQL, Docker and Google Gemini AI.

---

⭐ If you find this project useful, consider giving it a star.
