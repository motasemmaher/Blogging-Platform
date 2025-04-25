# Blogging Platform

A modern blogging platform with a Next.js frontend and Node.js backend, built with TypeScript.

## System Architecture

### Overview
The platform uses a client-server architecture with a clear separation between the frontend and backend services. The system is designed to be maintainable and follows modern development practices.

### Design Patterns

1. **Repository Pattern**
   - Used in model classes (UserModel, PostModel, CommentModel, TokenModel)
   - Abstracts database operations
   - Provides a clean interface for data access
   - Example: `UserModel.findByEmail()`, `PostModel.create()`

2. **Service Pattern**
   - Implemented in service classes (AuthService, PostService)
   - Handles business logic
   - Separates concerns from data access
   - Example: `AuthService.register()`, `PostService.createPost()`

3. **Middleware Factory Pattern**
   - Used in request validation and authorization
   - Creates reusable middleware functions
   - Example: `validateRequest()`, `authorize()`

4. **Singleton Pattern**
   - Database connection management
   - Configuration handling
   - Ensures single instance of critical resources

### Components

1. **Frontend (blog-platform-fe)**
   - Next.js with TypeScript
   - Server-side rendering for better performance
   - Features:
     - User authentication
     - Blog post creation and editing
     - Blog post viewing and commenting

2. **Backend (blog-platform-be)**
   - Node.js with TypeScript
   - RESTful API
   - Drizzle ORM for database operations
   - Features:
     - User authentication and authorization
     - Blog post CRUD operations
     - Comment management

### Data Flow

1. **Authentication**
   - Frontend sends credentials to backend
   - Backend validates and returns JWT token
   - Frontend stores token for subsequent requests

2. **Blog Operations**
   - Frontend makes API requests to backend
   - Backend processes requests and interacts with database
   - Results returned to frontend for display

### Design Decisions

1. **Technology Choices**
   - Next.js: For its SSR capabilities and developer experience
   - Node.js: Robust backend runtime
   - TypeScript: Type safety and better development experience
   - Drizzle ORM: Type-safe database operations
   - Docker: Consistent deployment

2. **Architecture**
   - Clear separation between frontend and backend
   - RESTful API for predictable communication
   - JWT for secure authentication

## Setup Instructions

### Prerequisites

#### Backend Requirements
1. **PostgreSQL Database**
   - Latest version installed and running
   - Create a new database for the project
   - Note down your database credentials (host, port, username, password, database name)

2. **Node.js**
   - Version 20 or above
   - Verify installation:
     ```bash
     node --version
     ```

3. **pnpm**
   - Package manager
   - Install if not present:
     ```bash
     npm install -g pnpm
     ```

### Backend Setup

1. **Environment Configuration**
   ```bash
   cd blog-platform-be
   nano .env
   ```
   Edit `.env` file with the following required variables:
   ```
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL=postgresql://username:password@host:5432/database_name

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   JWT_EXPIRE=1h
   JWT_REFRESH_EXPIRE=7d
   ```

   Where:
   - `PORT`: The port number for the backend server (default: 3001)
   - `NODE_ENV`: Environment mode (development/production)
   - `DATABASE_URL`: PostgreSQL connection string
     - username: your database username
     - password: your database password
     - host: database host (localhost or IP address)
     - database_name: name of your database
   - `JWT_SECRET`: Secret key for access token generation
   - `JWT_REFRESH_SECRET`: Secret key for refresh token generation
   - `JWT_EXPIRE`: Access token expiration time (e.g., 1h for 1 hour)
   - `JWT_REFRESH_EXPIRE`: Refresh token expiration time (e.g., 7d for 7 days)

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Database Setup**
   ```bash
   # Generate database types
   pnpm run db:generate

   # Run database migrations
   pnpm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   pnpm run dev
   ```
   The backend will be available at http://localhost:3001

### Frontend Setup

1. **Prerequisites**
   - Node.js version 20 or above
     ```bash
     node --version
     ```
   - pnpm package manager
     ```bash
     npm install -g pnpm
     ```

2. **Environment Configuration**
   ```bash
   cd blog-platform-fe
   nano .env
   ```
   Add the following environment variables:
   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   Where:
   - `NEXT_PUBLIC_BASE_URL`: Base URL for the frontend application
   - `NEXT_PUBLIC_API_URL`: URL of the backend API server

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Start Development Server**
   ```bash
   pnpm run dev
   ```
   The frontend will be available at http://localhost:3000

### Running with Docker
```bash
docker-compose up --build
```

Access the application at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development

- Backend runs on port 3001
- Frontend runs on port 3000
- API documentation available at `/api/docs` when backend is running

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
