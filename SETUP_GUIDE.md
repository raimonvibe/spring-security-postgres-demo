# Spring Security PostgreSQL Demo - Complete Setup Guide

This guide provides step-by-step instructions to successfully run the Spring Security PostgreSQL demo project on Ubuntu/Debian, macOS, or Windows.

## 🚀 Quick Start

1. **Install Prerequisites** (see detailed instructions below for your OS)
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
- **npm or yarn** - Package manager for frontend dependencies (npm comes with Node.js)

Install the prerequisites based on your operating system. Note: Administrative privileges may be required for installations.

### Installation on Ubuntu/Debian

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

### Installation on macOS

We recommend using Homebrew as the package manager. If you don't have Homebrew installed, install it from https://brew.sh/.

```bash
# Install Java 17
brew install openjdk@17

# Install Maven
brew install maven

# Install Node.js 18
brew install node@18

# Install PostgreSQL 14
brew install postgresql@14

# Add to PATH if needed (Homebrew usually handles this, but verify)
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc  # Or ~/.bash_profile for Bash
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc  # Reload shell
```

### Installation on Windows

We recommend using Chocolatey as the package manager for easier installation. If you don't have Chocolatey, install it from https://chocolatey.org/install (run in an elevated PowerShell).

```powershell
# Run these in an elevated (Administrator) PowerShell

# Install Java 17 (Adoptium OpenJDK)
choco install temurin17 -y

# Install Maven
choco install maven -y

# Install Node.js 18 (LTS version)
choco install nodejs-lts -y  # This installs 18.x or higher LTS

# Install PostgreSQL 14
choco install postgresql14 -y
```

If you prefer manual installation without Chocolatey:
- Download Java JDK 17 from https://adoptium.net/ and add to PATH.
- Download Maven from https://maven.apache.org/download.cgi, extract, and add bin to PATH.
- Download Node.js 18 from https://nodejs.org/en/download/ and install.
- Download PostgreSQL 14 from https://www.postgresql.org/download/windows/ and install (during setup, set password for 'postgres' user to '0000' if prompted).

After installation, restart your terminal/PowerShell or log out and back in to update PATH.

## 🗄️ Database Setup

### 1. Start PostgreSQL Service

#### Ubuntu/Debian
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew services start postgresql@14
```

#### Windows
The service starts automatically after installation. To start manually:
```powershell
# Run in elevated PowerShell
net start postgresql-x64-14  # Service name may vary; check Services app for exact name (e.g., postgresql-x64-14)
```

### 2. Configure Database

The application uses 'postgres' user with password '0000' and database 'auth_demo'. Adjust if your setup differs.

#### Ubuntu/Debian
```bash
# Set postgres user password to match application.properties
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '0000';"

# Create the required database
sudo -u postgres createdb auth_demo
```

#### macOS
On macOS with Homebrew, PostgreSQL uses your user account by default, but we'll create/configure the 'postgres' user.
```bash
# Initialize if not done (Homebrew usually does this)
initdb /opt/homebrew/var/postgresql@14  # Only if needed

# Create 'postgres' user if it doesn't exist and set password
createuser postgres || true  # Ignore if exists
psql -c "ALTER USER postgres PASSWORD '0000';"

# Create the required database
createdb -U postgres auth_demo
```

#### Windows
During PostgreSQL installation, you set the 'postgres' user password. If not set to '0000', run:
```powershell
# Open psql (assuming it's in PATH; default install path is C:\Program Files\PostgreSQL\14\bin)
psql -U postgres -c "ALTER USER postgres PASSWORD '0000';"

# Create the required database
createdb -U postgres auth_demo
```
Enter the current password when prompted if needed.

### 3. Verify Database Setup

#### All OS (adjust for user if needed)
```bash
# Test connection (should connect without errors; enter password '0000' if prompted)
psql -U postgres -d auth_demo -c "SELECT version();"
```

## 🔧 Backend Setup (Spring Boot)

These steps are the same across all OS.

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

These steps are the same across all OS.

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

- **Ubuntu/Debian**:
  ```bash
  # Check PostgreSQL status
  sudo systemctl status postgresql

  # Start PostgreSQL if not running
  sudo systemctl start postgresql

  # Verify database exists
  sudo -u postgres psql -l | grep auth_demo
  ```

- **macOS**:
  ```bash
  # Check PostgreSQL status
  brew services list | grep postgresql

  # Start PostgreSQL if not running
  brew services start postgresql@14

  # Verify database exists
  psql -U postgres -l | grep auth_demo
  ```

- **Windows**:
  ```powershell
  # Check service status (adjust service name)
  Get-Service postgresql-x64-14

  # Start if not running
  net start postgresql-x64-14

  # Verify database exists
  psql -U postgres -l | Select-String auth_demo
  ```

#### 2. "Maven command not found"
**Problem**: Maven is not installed or not in PATH.

**Solution**: Reinstall Maven as per your OS instructions above, and ensure it's added to PATH. Verify with `mvn -version`.

#### 3. "Java version incompatibility"
**Problem**: Wrong Java version installed.

**Solution**: Check with `java -version` (should be 17+). Reinstall as per your OS if needed.

#### 4. Frontend fails to connect to backend
**Problem**: Backend not running or CORS issues.

**Solution**:
- Ensure backend is running on port 8080
- Check that both frontend and backend are running simultaneously
- Verify no firewall blocking localhost connections (e.g., on Windows, check Windows Defender Firewall)

#### 5. "Port already in use"
**Problem**: Another service is using port 8080 or 3000.

**Solution**:

- **Ubuntu/Debian or macOS**:
  ```bash
  # Find process using port 8080
  lsof -i :8080

  # Kill the process if needed
  kill -9 <PID>
  ```

- **Windows**:
  ```powershell
  # Find process using port 8080
  netstat -ano | findstr :8080

  # Kill the process if needed
  taskkill /PID <PID> /F
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
