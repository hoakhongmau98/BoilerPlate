# Node.js 22 Boilerplate with Service-Repository Pattern

## 🚀 Overview

This project has been upgraded to Node.js 22 and restructured to implement a modern **Service-Repository Pattern** architecture. The upgrade includes comprehensive dependency updates, security fixes, and improved TypeScript configuration.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Upgrade Summary](#upgrade-summary)
- [Security Improvements](#security-improvements)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- **Node.js 22** - Latest LTS version with improved performance
- **TypeScript 5.9** - Modern TypeScript with strict type checking
- **Service-Repository Pattern** - Clean separation of concerns
- **Dependency Injection** - Using InversifyJS for better testability
- **Express 5** - Latest Express.js with improved middleware
- **Sequelize 6.37** - Latest ORM with enhanced features
- **Security Hardened** - All vulnerabilities fixed
- **Modern ES2022** - Latest JavaScript features
- **Comprehensive Error Handling** - Global error handling and logging
- **Health Check Endpoint** - `/health` for monitoring
- **API Documentation** - Swagger/OpenAPI integration

## 🏗️ Architecture

### Service-Repository Pattern

The application follows a clean architecture with clear separation of concerns:

```
Controller → Service → Repository → Database
```

#### Components:

1. **Controllers** (`src/controllers/`)
   - Handle HTTP requests and responses
   - Input validation and sanitization
   - Error handling and status codes

2. **Services** (`src/services/`)
   - Business logic implementation
   - Data validation and transformation
   - Orchestration of multiple repositories

3. **Repositories** (`src/repositories/`)
   - Data access layer
   - Database operations
   - Query optimization

4. **Models** (`src/models/`)
   - Sequelize model definitions
   - Data validation rules
   - Model associations

### Dependency Injection

Using InversifyJS for dependency management:

```typescript
// Container configuration
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

// Service usage
const userService = getService<IUserService>(TYPES.UserService);
```

## 📋 Prerequisites

- **Node.js 22.0.0** or higher
- **npm 10.0.0** or higher
- **MySQL 8.0** or higher
- **TypeScript 5.9** or higher

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Run migrations
   npx sequelize-cli db:migrate
   
   # Run seeders (optional)
   npx sequelize-cli db:seed:all
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run test` | Run Jest tests |
| `npm run watch` | Watch mode for development |
| `npm run clean` | Clean build directory |

## 📚 API Documentation

### Health Check
```
GET /health
```

### User Management
```
GET    /api/users              # Get all users with pagination
GET    /api/users/:id          # Get user by ID
POST   /api/users              # Create new user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
POST   /api/users/authenticate # Authenticate user
PUT    /api/users/:userId/password # Change password
GET    /api/users/stats        # Get user statistics
POST   /api/users/bulk-create  # Bulk create users
PUT    /api/users/bulk-update  # Bulk update users
DELETE /api/users/bulk-delete  # Bulk delete users
```

### Swagger Documentation
Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

## 📁 Project Structure

```
src/
├── configs/           # Configuration files
│   ├── container.ts   # Dependency injection container
│   ├── routes.ts      # Route definitions
│   └── settings.ts    # Application settings
├── controllers/       # HTTP controllers
│   └── api/
│       └── user/
│           └── user.controller.ts
├── services/          # Business logic services
│   ├── base.service.ts
│   ├── user.service.ts
│   └── mailer.service.ts
├── repositories/      # Data access layer
│   ├── base.repository.ts
│   └── user.repository.ts
├── models/           # Sequelize models
│   └── users.ts
├── entities/         # Database entities
├── interfaces/       # TypeScript interfaces
├── middlewares/      # Express middlewares
├── initializers/     # Application initializers
├── database/         # Database configuration
├── swagger/          # API documentation
└── server.ts         # Application entry point
```

## 🔄 Upgrade Summary

### Node.js Version
- **Before**: Node.js 16/18
- **After**: Node.js 22.16.0

### Major Dependency Updates

| Package | Before | After | Notes |
|---------|--------|-------|-------|
| Node.js | 16/18 | 22.16.0 | Latest LTS |
| TypeScript | 4.3.5 | 5.9.2 | Modern features |
| Express | 4.17.1 | 5.1.0 | Latest version |
| Sequelize | 6.6.5 | 6.37.7 | Enhanced ORM |
| bcryptjs | 2.4.3 | 3.0.2 | Security improvements |
| jsonwebtoken | 8.5.1 | 9.0.2 | Security fixes |
| mysql2 | 2.2.5 | 3.14.3 | Latest driver |
| multer | 1.4.3 | 2.0.2 | Security fixes |

### New Dependencies Added
- `reflect-metadata` - For decorators
- `class-transformer` - Object transformation
- `class-validator` - Validation decorators
- `inversify` - Dependency injection
- `tsyringe` - Alternative DI container

### Architecture Changes
- ✅ Implemented Service-Repository Pattern
- ✅ Added Dependency Injection with InversifyJS
- ✅ Enhanced error handling and logging
- ✅ Improved TypeScript configuration
- ✅ Added comprehensive validation
- ✅ Implemented bulk operations
- ✅ Added health check endpoint

## 🔒 Security Improvements

### Fixed Vulnerabilities
- ✅ **37 vulnerabilities** resolved (8 low, 9 moderate, 18 high, 2 critical)
- ✅ Updated all packages to latest secure versions
- ✅ Enhanced CORS configuration
- ✅ Improved session security
- ✅ Added input validation and sanitization
- ✅ Implemented proper error handling

### Security Features
- **Input Validation**: Comprehensive validation using class-validator
- **SQL Injection Protection**: Sequelize ORM with parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Enhanced session configuration
- **Rate Limiting**: Ready for implementation
- **Security Headers**: Express security middleware ready

## 🧪 Development

### Code Quality
```bash
# Lint code
npm run lint

# Type checking
npm run build
```

### Testing
```bash
# Run tests
npm test

# Watch mode
npm run watch-test
```

### Database Operations
```bash
# Create migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npx sequelize-cli db:migrate

# Undo migration
npx sequelize-cli db:migrate:undo

# Create seeder
npx sequelize-cli seed:generate --name seeder-name

# Run seeders
npx sequelize-cli db:seed:all
```

## 🚀 Deployment

### Environment Variables
```bash
# Required
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/database

# Optional
ALLOWED_ORIGINS=https://yourdomain.com
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
```

### Docker Deployment
```bash
# Build image
docker build -t your-app .

# Run container
docker run -p 3000:3000 your-app
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/server.js --name "your-app"

# Monitor
pm2 monit
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the logs for debugging information

---

**Last Updated**: December 2024
**Node.js Version**: 22.16.0
**TypeScript Version**: 5.9.2

