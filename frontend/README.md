# Job Tracker 🚀

A full stack web application to track job applications built with Spring Boot and React.

## Features
- User Registration & Login with encrypted passwords
- Add, Edit, Delete job applications
- Filter by application status
- Search by company name
- Dashboard with statistics

## Tech Stack
### Backend
- Java 17
- Spring Boot 4
- Spring Security
- Spring Data JPA
- MySQL
- Lombok

### Frontend
- React.js
- Axios
- React Router DOM

## Getting Started

### Backend Setup
1. Clone the repository
2. Create MySQL database: `CREATE DATABASE jobtracker;`
3. Copy `application.properties.example` to `application.properties`
4. Update database credentials in `application.properties`
5. Run `BackendApplication.java` in IntelliJ

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the app: `npm start`
4. Open `http://localhost:3000`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register user |
| POST | /api/users/login | Login user |
| GET | /api/jobs/{userId} | Get all jobs |
| POST | /api/jobs/{userId} | Add job |
| PUT | /api/jobs/{jobId} | Update job |
| DELETE | /api/jobs/{jobId} | Delete job |
| GET | /api/jobs/{userId}/filter | Filter by status |
| GET | /api/jobs/{userId}/search | Search by company |
| GET | /api/jobs/{userId}/dashboard | Dashboard stats |

## Live Demo
Coming soon! 🚀

## Author
Shruti Buwade