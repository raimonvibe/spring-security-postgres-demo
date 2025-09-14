# Spring Security PostgreSQL Demo - Complete Setup Guide

This guide provides step-by-step instructions to successfully run the Spring Security PostgreSQL demo project.

## 🚀 Quick Start

1. **Install Prerequisites** (see detailed instructions below)
2. **Setup Database** (PostgreSQL)
3. **Run Backend** (Spring Boot on port 8080)
4. **Run Frontend** (Next.js on port 3000)
5. **Test Application** (Login with admin/admin or user/user)

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

### Required Software
- **Java JDK 17+** - Required for Spring Boot backend
- **Maven 3.8+** - Build tool for Java backend
- **Node.js 18+** - Required for Next.js frontend
- **PostgreSQL 14+** - Database server
- **npm or yarn** - Package manager for frontend dependencies

### Installation Commands (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Java 17
sudo apt install -y openjdk-17-jdk

# Install Maven
sudo apt install -y maven

# Install Node.js 18+ (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

## 🗄️ Database Setup

### 1. Start PostgreSQL Service
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Configure Database
```bash
# Set postgres user password to match application.properties
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"

# Create the required database
sudo -u postgres createdb auth_demo
```

### 3. Verify Database Setup
```bash
# Test connection (should connect without errors)
sudo -u postgres psql -d auth_demo -c "SELECT version();"
```

## 🔧 Backend Setup (Spring Boot)

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Compile the Project
```bash
mvn clean compile
```

### 3. Run the Backend
```bash
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### Expected Output
You should see output similar to:
```
Started DemoApplication in X.XXX seconds (process running for X.XXX)
Tomcat started on port 8080 (http) with context path '/'
```

## 🌐 Frontend Setup (Next.js)

### 1. Open New Terminal and Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

## 🧪 Testing the Application

### 1. Access the Application
Open your browser and navigate to: **http://localhost:3000**

### 2. Test Authentication Flow
1. Click "Go to Protected Page" - you should be redirected to login
2. Use one of these test credentials:
   - **Admin User**: username `admin`, password `admin`
   - **Regular User**: username `user`, password `user`
3. After successful login, you should see the protected content

### 3. Verify Backend API
Test the backend directly:
```bash
# Should redirect to login (302 status)
curl -I http://localhost:8080/home

# Should return login page
curl http://localhost:8080/login
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. "Connection to localhost:5432 refused"
**Problem**: PostgreSQL is not running or not configured correctly.

**Solution**:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Verify database exists
sudo -u postgres psql -l | grep auth_demo
```

#### 2. "Maven command not found"
**Problem**: Maven is not installed.

**Solution**:
```bash
sudo apt install -y maven
```

#### 3. "Java version incompatibility"
**Problem**: Wrong Java version installed.

**Solution**:
```bash
# Check Java version (should be 17+)
java -version

# Install Java 17 if needed
sudo apt install -y openjdk-17-jdk
```

#### 4. Frontend fails to connect to backend
**Problem**: Backend not running or CORS issues.

**Solution**:
- Ensure backend is running on port 8080
- Check that both frontend and backend are running simultaneously
- Verify no firewall blocking localhost connections

#### 5. "Port already in use"
**Problem**: Another service is using port 8080 or 3000.

**Solution**:
```bash
# Find process using port 8080
sudo lsof -i :8080

# Kill the process if needed
sudo kill -9 <PID>
```

## 📁 Project Structure

```
spring-security-postgres-demo-v2/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # Next.js application
│   ├── src/app/           # React components
│   └── package.json       # npm dependencies
└── README.md              # Project overview
```

## 🔐 Default User Accounts

The application comes with pre-configured test users:

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin    | ADMIN |
| user     | user     | USER  |

These credentials are defined in `backend/src/main/resources/data.sql` and are automatically loaded when the application starts.

## 🚀 Production Deployment Notes

For production deployment, consider:

1. **Change default passwords** in `data.sql`
2. **Update database credentials** in `application.properties`
3. **Configure proper CORS origins** in `SecurityConfig.java`
4. **Use environment variables** for sensitive configuration
5. **Enable HTTPS** for secure authentication

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the application logs for detailed error messages
2. Verify all prerequisites are correctly installed
3. Ensure PostgreSQL is running and accessible
4. Confirm both backend and frontend are running simultaneously

## 🎯 Success Criteria

You know the setup is working correctly when:

- ✅ Backend starts without errors on port 8080
- ✅ Frontend starts without errors on port 3000  
- ✅ You can access http://localhost:3000 in your browser
- ✅ Authentication redirects work properly
- ✅ You can login with admin/admin or user/user
- ✅ Protected pages are accessible after login
