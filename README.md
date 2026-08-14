# Zoo Management System

Zoo Management System is a full-stack web application for managing zoo operations such as animals, keepers, enclosures, feeding, health checks, tickets, and reports. The project uses an ASP.NET Core Web API backend, MongoDB for data storage, and a static HTML/CSS/JavaScript frontend.

## Project Features

- Dashboard overview for zoo statistics and quick navigation
- Animal management with create, view, update, and delete operations
- Keeper management for assigning staff to zoo animals
- Enclosure management for tracking animal housing
- Animal-to-keeper assignment
- Animal-to-enclosure assignment
- Feeding schedule and food requirement tracking
- Health check record management
- Ticket management for visitor ticket data
- Reports for animals, revenue, visitors, and food requirements
- Swagger API documentation for backend testing
- Clean layered backend structure with Domain, Application, Infrastructure, and API projects

## Technology Stack

- Backend: ASP.NET Core Web API
- Runtime: .NET 10
- Database: MongoDB
- Frontend: HTML, CSS, JavaScript
- API Documentation: Swagger / Swashbuckle

## Project Structure

```text
InfinityLoop-ZooManagementSystem/
|-- README.md
|-- .gitignore
`-- ZooManagementSystem/
    |-- ZooManagementSystem.slnx
    |-- ZooManagementSystem.API/
    |-- ZooManagementSystem.Application/
    |-- ZooManagementSystem.Domain/
    |-- ZooManagementSystem.Infrastructure/
    `-- ZooManagementSystem.Frontend/
```

## Prerequisites

Install the following before running the project locally:

- Git
- .NET 10 SDK
- MongoDB Community Server or a running MongoDB instance
- A modern browser such as Chrome, Edge, or Firefox

## Clone the Repository

```bash
git clone <repository-url>
cd InfinityLoop-ZooManagementSystem
```

Replace `<repository-url>` with the actual GitHub repository URL.

## Database Setup

By default, the backend connects to MongoDB using:

```text
mongodb://localhost:27017
```

The default database name is:

```text
ZooManagementSystem
```

Make sure MongoDB is running locally before starting the API.

If you need to change the MongoDB connection, update:

```text
ZooManagementSystem/ZooManagementSystem.API/appsettings.json
```

Default configuration:

```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "ZooManagementSystem"
  }
}
```

## Restore Dependencies

From the inner project folder, restore the .NET packages:

```bash
cd ZooManagementSystem
dotnet restore ZooManagementSystem.slnx
```

## Run the Backend API

Start the ASP.NET Core API:

```bash
dotnet run --project ZooManagementSystem.API --launch-profile http
```

The API will run at:

```text
http://localhost:5255
```

Swagger will be available at:

```text
http://localhost:5255/swagger
```

## Run the Frontend Locally

The frontend is a static HTML/CSS/JavaScript app. The API base URL is configured in:

```text
ZooManagementSystem/ZooManagementSystem.Frontend/js/api.js
```

Current API URL:

```javascript
const API_BASE_URL = 'http://localhost:5255/api';
```

To run the frontend, open this file in your browser:

```text
ZooManagementSystem/ZooManagementSystem.Frontend/index.html
```

You can also serve the frontend with any simple static server from the frontend folder.

Example:

```bash
cd ZooManagementSystem.Frontend
python -m http.server 5500
```

Then visit:

```text
http://localhost:5500
```

## Useful API Endpoints

Base API URL:

```text
http://localhost:5255/api
```

Main endpoints:

- `GET /api/animals`
- `POST /api/animals`
- `GET /api/animals/{id}`
- `PUT /api/animals/{id}`
- `DELETE /api/animals/{id}`
- `POST /api/animals/{animalId}/keeper/{keeperId}`
- `POST /api/animals/{animalId}/enclosure/{enclosureId}`
- `POST /api/animals/{id}/feed`
- `POST /api/animals/{id}/health-check`
- `GET /api/keepers`
- `GET /api/enclosures`
- `GET /api/tickets`
- `GET /api/reports/animals`
- `GET /api/reports/revenue`
- `GET /api/reports/visitors`
- `GET /api/reports/food-requirements`

## Recommended Local Run Order

1. Start MongoDB.
2. Restore backend dependencies.
3. Run the backend API.
4. Open Swagger and confirm the API is working.
5. Open or serve the frontend.
6. Use the frontend to manage zoo data.

## Troubleshooting

### API does not start

- Confirm the .NET 10 SDK is installed.
- Run `dotnet restore ZooManagementSystem.slnx`.
- Make sure you are running the command from the `ZooManagementSystem` folder.

### Frontend cannot load data

- Confirm the backend is running at `http://localhost:5255`.
- Confirm MongoDB is running.
- Check that `API_BASE_URL` in `ZooManagementSystem.Frontend/js/api.js` matches the backend URL.

### MongoDB connection error

- Start MongoDB locally.
- Confirm the connection string in `appsettings.json`.
- Make sure MongoDB is listening on port `27017`.

## Development Notes

- The backend uses a layered architecture:
  - `Domain` contains core models and enums.
  - `Application` contains DTOs, interfaces, services, and business logic.
  - `Infrastructure` contains MongoDB repositories.
  - `API` exposes HTTP endpoints and application configuration.
- The frontend uses plain JavaScript modules and reusable component HTML files.
- Swagger is enabled for easier API testing during development.
