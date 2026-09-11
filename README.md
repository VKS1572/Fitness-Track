# FitTrack — Fitness Tracking Platform

A full-stack fitness tracking platform built using **Java Spring Boot microservices, React, MySQL, Docker, Eureka Service Discovery, and JWT authentication**.

FitTrack allows users to register and verify their email, securely log in, manage their profile, track fitness activities, receive notifications, and access personalized fitness recommendations.

---

## 🚀 Key Features

* 🔐 JWT-based authentication and authorization
* 📧 Email verification using OTP
* 🔑 Forgot password and password reset using OTP
* 👤 User profile management
* 🖼️ Profile image upload and retrieval
* 🏃 Fitness activity tracking
* 🔔 Notification management
* 🤖 Fitness recommendation service
* 🌐 API Gateway for centralized routing
* 🔎 Eureka-based service discovery
* 🐳 Dockerized microservices
* 🗄️ MySQL databases
* 🧪 Unit testing across backend services
* ⚛️ React/Vite frontend

---

## 🏗️ Architecture

FitTrack follows a **microservices architecture** where individual business capabilities are separated into independently deployable services.

```text
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │   Vite / JavaScript │
                         │    localhost:5173   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    API Gateway      │
                         │    Spring Cloud     │
                         │    localhost:8080   │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌─────────────┐ ┌─────────────┐ ┌───────────────┐
             │ User Service│ │Activity Svc │ │Recommendation │
             │    :8081    │ │    :8082    │ │    :8083      │
             └──────┬──────┘ └──────┬──────┘ └───────────────┘
                    │               │
                    │               ▼
                    │        ┌───────────────┐
                    │        │ Notification  │
                    │        │ Service :8084 │
                    │        └───────────────┘
                    │
                    ▼
              ┌─────────────┐
              │    MySQL    │
              └─────────────┘

                         ┌─────────────────────┐
                         │  Eureka Registry    │
                         │    localhost:8761   │
                         └─────────────────────┘
```

### Services

| Service                |   Port | Responsibility                                   |
| ---------------------- | -----: | ------------------------------------------------ |
| API Gateway            | `8080` | Central entry point and request routing          |
| User Service           | `8081` | Registration, authentication, users and profiles |
| Activity Service       | `8082` | Fitness activity management                      |
| Recommendation Service | `8083` | Fitness recommendations                          |
| Notification Service   | `8084` | User notifications                               |
| Service Registry       | `8761` | Eureka service discovery                         |
| MySQL                  | `3307` | Persistent application data                      |

---

## 🔐 Authentication Flow

FitTrack uses JWT-based authentication.

```text
User
 │
 ▼
React Frontend
 │
 │ POST /api/users/login
 ▼
API Gateway
 │
 ▼
User Service
 │
 ├── Validate credentials
 ├── Check email verification
 └── Generate JWT
       │
       ▼
React stores authentication token
       │
       ▼
Protected API requests
       │
       ├── Authorization: Bearer <JWT>
       │
       ▼
API Gateway
       │
       ▼
Microservice
```

The JWT contains information required by the application, including the authenticated user's identity and role.

Protected requests are validated before accessing secured resources.

---

## 📧 Email Verification

New users go through an OTP-based email verification process.

```text
Register
   │
   ▼
User Service
   │
   ├── Create user
   ├── Generate OTP
   └── Send OTP through email
          │
          ▼
      User enters OTP
          │
          ▼
    /verify-email
          │
          ▼
    Email verified
```

The application also supports:

* Resending verification OTP
* Forgot password
* Password reset OTP
* Resetting the password

Email credentials are supplied through environment variables rather than being committed to the repository.

---

## 🏃 Activity Tracking

The Activity Service manages fitness activity data.

When an activity is created successfully, the service can trigger a notification for the user.

```text
React
  │
  ▼
API Gateway
  │
  ▼
Activity Service
  │
  ├── Save activity
  │
  └── Call Notification Service
             │
             ▼
       Create notification
             │
             ▼
        Notification UI
```

Service-to-service communication uses **Eureka service discovery and Spring Cloud LoadBalancer** rather than relying on hard-coded Docker container hostnames for internal service communication.

---

## 🔔 Notification System

The Notification Service provides APIs for managing user notifications.

Supported operations include:

* Get notifications for a user
* Create a notification
* Mark a notification as read
* Mark all notifications as read
* Delete a notification

Example flow:

```text
Activity Created
       │
       ▼
Activity Service
       │
       ▼
Notification Service
       │
       ▼
Notification stored in MySQL
       │
       ▼
React Notification Bell
```

---

## 👤 User Profile

Users can manage their profile through the User Service.

Supported functionality includes:

* User information retrieval
* User information update
* Profile image upload
* Profile image retrieval
* Profile image removal
* Password management

Profile images are handled through the User Service and persisted with the user's profile data.

---

## 🌐 API Gateway

The API Gateway provides a single entry point for the frontend.

Routes include:

```text
/api/users/**            → USER-SERVICE
/api/activities/**       → ACTIVITY-SERVICE
/api/recommendations/**  → RECOMMENDATION-SERVICE
/api/notifications/**    → NOTIFICATION-SERVICE
```

The gateway also handles:

* CORS configuration
* JWT resource-server authentication
* Eureka-based service discovery
* Load-balanced routing

This keeps the frontend independent of individual backend service locations.

---

## 🔎 Service Discovery

FitTrack uses **Netflix Eureka** for service registration and discovery.

```text
                 Eureka
                   │
       ┌───────────┼────────────┐
       │           │            │
       ▼           ▼            ▼
 USER-SERVICE  ACTIVITY-SERVICE  NOTIFICATION-SERVICE
       │           │            │
       └───────────┼────────────┘
                   │
             API Gateway
```

Services register themselves with Eureka and can discover other services by logical service name.

---

## 🗄️ Database

FitTrack uses **MySQL** for persistent storage.

The services use Spring Data JPA/Hibernate for database access.

The application separates service data into dedicated databases, including:

```text
fitness_user_db
fitness_activity_db
fitness_db
```

Database credentials are supplied through environment variables.

---

## 🐳 Docker

All major backend components are containerized.

### Containers

```text
fittrack-api-gateway
fittrack-user-service
fittrack-activity-service
fittrack-recommendation-service
fittrack-notification-service
fittrack-service-registry
fittrack-mysql
```

The complete backend environment can be started using Docker Compose.

### Start the application

```bash
docker compose up -d
```

### Check running containers

```bash
docker compose ps
```

### Stop containers

```bash
docker compose down
```

> Avoid using `docker compose down -v` unless you intentionally want to remove the database volumes and application data.

---

## ⚛️ Frontend

The frontend is built using:

* React
* Vite
* JavaScript
* Axios
* CSS

The frontend communicates with the backend through the API Gateway rather than calling individual microservices directly.

### Run frontend

```bash
cd fitness-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend entry point:

```text
http://localhost:8080
```

---

## 🛠️ Technology Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* Spring Cloud Gateway
* Eureka Service Discovery
* Spring Cloud LoadBalancer
* JWT
* Maven

### Frontend

* React
* Vite
* JavaScript
* Axios
* HTML
* CSS

### Database

* MySQL

### DevOps / Tools

* Docker
* Docker Compose
* Git
* GitHub
* IntelliJ IDEA
* Postman

---

## 🧪 Testing

Backend services include unit tests for the main business logic.

Current test results:

| Service                |     Tests |
| ---------------------- | --------: |
| User Service           |       8/8 |
| Activity Service       |       5/5 |
| Notification Service   |       5/5 |
| Recommendation Service |       3/3 |
| API Gateway            |       1/1 |
| **Total**              | **22/22** |

All currently implemented backend tests are passing.

---

## 📁 Project Structure

```text
Fitness-Track/
│
├── activity-service/
│
├── api-gateway/
│
├── notification-service/
│
├── recommendation-service/
│
├── service-registry/
│
├── user-service/
│
├── fitness-frontend/
│
├── docker-compose.yml
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔒 Environment Variables

Sensitive configuration is not committed to Git.

Create a local `.env` file based on `.env.example`.

Example:

```env
MYSQL_ROOT_PASSWORD=your_mysql_password
MAIL_USERNAME=your_gmail_address
MAIL_PASSWORD=your_gmail_app_password
```

`.env` should remain local and must **not** be committed.

The repository contains `.env.example` with placeholder values for setup reference.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/VKS1572/Fitness-Track.git
cd Fitness-Track
```

### 2. Configure environment variables

Create:

```text
.env
```

using:

```text
.env.example
```

as the template.

### 3. Start backend services

```bash
docker compose up -d
```

### 4. Verify containers

```bash
docker compose ps
```

### 5. Open Eureka

```text
http://localhost:8761
```

### 6. Start frontend

```bash
cd fitness-frontend
npm install
npm run dev
```

### 7. Open application

```text
http://localhost:5173
```

---

## 🔍 API Examples

### User Registration

```http
POST /api/users/register
```

### Login

```http
POST /api/users/login
```

### Verify Email

```http
POST /api/users/verify-email
```

### Activity

```http
POST /api/activities
```

### User Activities

```http
GET /api/activities/user/{userId}
```

### Notifications

```http
GET /api/notifications/user/{userId}
```

### Mark Notification as Read

```http
PUT /api/notifications/{id}/read
```

---

## 📌 Engineering Highlights

The project demonstrates practical implementation of:

* Microservice decomposition
* Service discovery using Eureka
* API Gateway routing
* JWT authentication
* Stateless Spring Security
* REST API development
* JPA/Hibernate persistence
* Inter-service communication
* Client-side API integration
* Docker containerization
* Environment-based secret management
* Unit testing with Spring Boot
* React frontend integration

---

## 🔮 Future Improvements

Potential future improvements include:

* Centralized configuration using Spring Cloud Config
* Distributed tracing
* Centralized logging
* API documentation with OpenAPI/Swagger
* Redis caching
* More advanced recommendation algorithms
* Role-based authorization across all services
* CI/CD pipeline
* Kubernetes deployment
* Cloud deployment
* Automated integration and end-to-end testing

---

## 👨‍💻 Author

**Vikas Pradhan**

Java Full Stack Developer Trainee | Java | Spring Boot | REST APIs | React

* GitHub: https://github.com/VKS1572
* LinkedIn: https://www.linkedin.com/in/vikas-pradhan-14225021b/
* Portfolio: https://vikaspradhan.vercel.app/
* LeetCode: https://leetcode.com/u/Vikas1572/

---

## 📄 License

This project is currently intended as a personal learning and portfolio project.
