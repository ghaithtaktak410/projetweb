# MySQL Setup Guide

## Windows

### Using MySQL Installer

1. Download from https://dev.mysql.com/downloads/mysql/
2. Run the installer
3. Select "MySQL Server" and "MySQL Workbench"
4. Choose setup type: "Developer Default"
5. Configure port: 3306
6. Configure MySQL as a Windows Service
7. Create the default user and set password

### Using Command Line

After installation, open Command Prompt:

```cmd
mysql -u root -p
```

Enter your password, then create the database:

```sql
CREATE DATABASE explore_france;
```

### Check MySQL Service

```cmd
wmic service where name="MySQL80" get status
```

Or check in Services:
- Press Win + R
- Type `services.msc`
- Look for "MySQL80" or "MySQL" and verify it's running

---

## macOS

### Using Homebrew (Recommended)

```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Verify installation
mysql --version
```

### Create Database

```bash
# Connect to MySQL
mysql -u root

# Create database
CREATE DATABASE explore_france;
```

### Stop/Start Service

```bash
# Start
brew services start mysql

# Stop
brew services stop mysql

# Restart
brew services restart mysql
```

---

## Linux (Ubuntu/Debian)

### Install MySQL

```bash
sudo apt-get update
sudo apt-get install mysql-server
```

### Secure Installation

```bash
sudo mysql_secure_installation
```

Follow prompts to set root password and remove anonymous users.

### Create Database

```bash
# Connect to MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE explore_france;
```

### Manage Service

```bash
# Start
sudo systemctl start mysql

# Stop
sudo systemctl stop mysql

# Restart
sudo systemctl restart mysql

# Check status
sudo systemctl status mysql

# Enable auto-start
sudo systemctl enable mysql
```

---

## Connection Test

### From Command Line

```bash
mysql -h localhost -u root -p explore_france
```

### From Node.js

```javascript
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'explore_france'
})

console.log('Connected to MySQL!')
```

---

## Common Issues

### Connection Refused

**Error:** `connect ECONNREFUSED 127.0.0.1:3306`

**Solutions:**
1. Verify MySQL is running
2. Check port 3306 is not blocked
3. Check credentials in `.env`
4. Restart MySQL service

### Access Denied

**Error:** `Access denied for user 'root'@'localhost'`

**Solutions:**
1. Verify password in `.env`
2. Reset root password:
   ```bash
   # Linux/Mac
   sudo mysqld_safe --skip-grant-tables
   mysql -u root
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   ```

### Port Already in Use

**Error:** `port 3306 is already in use`

**Solutions:**
1. Find process using port:
   ```bash
   # Linux/Mac
   lsof -i :3306
   
   # Windows
   netstat -ano | findstr :3306
   ```
2. Kill process or change MySQL port

### Database Not Found

**Error:** `Unknown database 'explore_france'`

**Solution:**
```sql
CREATE DATABASE explore_france;
```

---

## Backup & Restore

### Backup Database

```bash
mysqldump -u root -p explore_france > explore_france_backup.sql
```

### Restore Database

```bash
mysql -u root -p explore_france < explore_france_backup.sql
```

---

## GUI Tools

### MySQL Workbench

- Download: https://www.mysql.com/products/workbench/
- Connect to your MySQL server
- Browse tables and data
- Run queries

### DBeaver

- Download: https://dbeaver.io/
- Universal database tool
- Supports MySQL, PostgreSQL, etc.

---

## Environment Configuration

Update `.env` file with your credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=explore_france
```

**Note:** Change `your_password` to the password you set during installation.

---

## Production Setup

For production environments:

1. Use strong, complex passwords
2. Create limited-privilege users:
   ```sql
   CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON explore_france.* TO 'app_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Enable SSL connections
4. Regular backups
5. Monitor performance
6. Keep MySQL updated

---

## Verify Setup

Run this to verify everything is working:

```bash
# Terminal 1 - Start backend
npm run dev:server

# Terminal 2 - Check health
curl http://localhost:5000/api/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

If you see `ok`, MySQL setup is working!

---

## Next Steps

1. Follow QUICKSTART.md to run the application
2. Access admin panel at `/admin`
3. Create first region and quiz
4. Test quiz functionality

