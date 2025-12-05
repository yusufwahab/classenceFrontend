# API Endpoints & Payloads Documentation

## Authentication Endpoints

### POST /auth/register (Student Registration)
**Request Payload:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@student.edu",
  "matricNumber": "CS/2023/001",
  "departmentId": "computer-science",
  "password": "securePassword123",
  "role": "student"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "user": {
    "id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@student.edu",
    "matricNumber": "CS/2023/001",
    "role": "student",
    "departmentId": "computer-science",
    "hasSignature": false
  }
}
```

### POST /auth/register-admin (Admin Registration)
**Request Payload:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@admin.edu", 
  "departmentName": "Computer Science",
  "adminCode": "ADMIN_SECRET_CODE",
  "password": "adminPassword123",
  "role": "admin"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Admin registered and department created successfully",
  "user": {
    "id": "admin_id_here",
    "firstName": "Jane",
    "lastName": "Smith", 
    "email": "jane.smith@admin.edu",
    "role": "admin",
    "departmentId": "computer-science",
    "departmentName": "Computer Science"
  },
  "token": "jwt_token_here"
}
```

### POST /auth/login
**Request Payload:**
```json
{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "firstName": "User",
    "lastName": "Name",
    "email": "user@example.com",
    "role": "student|admin",
    "departmentId": "department_id",
    "departmentName": "Department Name",
    "hasSignature": true
  },
  "token": "jwt_token_here"
}
```

## Profile Endpoints

### POST /profile/signature
**Request Payload:**
```json
{
  "signatureImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Signature saved successfully"
}
```

### GET /profile/me
**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "User",
    "lastName": "Name", 
    "email": "user@example.com",
    "role": "student|admin",
    "departmentId": "department_id",
    "departmentName": "Department Name",
    "matricNumber": "CS/2023/001",
    "hasSignature": true,
    "signatureUrl": "/uploads/signatures/user_id.png"
  }
}
```

## Student Endpoints

### GET /student/dashboard
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "attendanceStats": {
      "totalDays": 45,
      "presentDays": 38,
      "attendanceRate": 84.4
    },
    "todayAttendance": {
      "marked": true,
      "time": "2024-01-15T09:30:00Z"
    },
    "recentUpdates": [
      {
        "id": "update_id",
        "title": "Class Schedule Change",
        "content": "Tomorrow's class is moved to 2 PM",
        "createdAt": "2024-01-14T10:00:00Z",
        "author": "Dr. Smith"
      }
    ]
  }
}
```

### POST /student/attendance
**Request Payload:** (Auto-generated from user session)
```json
{}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "attendance": {
    "id": "attendance_id",
    "date": "2024-01-15",
    "time": "09:30:00",
    "studentName": "John Doe",
    "matricNumber": "CS/2023/001",
    "signatureUrl": "/uploads/signatures/user_id.png"
  }
}
```

### GET /student/updates
**Expected Response:**
```json
{
  "success": true,
  "updates": [
    {
      "id": "update_id",
      "title": "Important Announcement",
      "content": "Please attend the department meeting tomorrow",
      "createdAt": "2024-01-14T10:00:00Z",
      "author": "Dr. Smith"
    }
  ]
}
```

### GET /student/attendance-log
**Query Parameters:**
- `startDate`: "2024-01-01" (optional)
- `endDate`: "2024-01-31" (optional)
- `page`: 1 (optional)
- `limit`: 10 (optional)

**Expected Response:**
```json
{
  "success": true,
  "attendanceLog": [
    {
      "id": "attendance_id",
      "date": "2024-01-15",
      "time": "09:30:00",
      "status": "present"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 45
  }
}
```

## Admin Endpoints

### GET /admin/dashboard
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalStudents": 150,
      "todayAttendance": 128,
      "attendanceRate": 85.3,
      "totalUpdates": 12
    },
    "recentStudents": [
      {
        "id": "student_id",
        "firstName": "John",
        "lastName": "Doe",
        "matricNumber": "CS/2023/001",
        "joinedAt": "2024-01-10T08:00:00Z"
      }
    ],
    "attendanceTrend": [
      { "date": "2024-01-10", "count": 120 },
      { "date": "2024-01-11", "count": 125 },
      { "date": "2024-01-12", "count": 118 }
    ]
  }
}
```

### GET /admin/students
**Query Parameters:**
- `search`: "john" (optional)
- `page`: 1 (optional)
- `limit`: 20 (optional)

**Expected Response:**
```json
{
  "success": true,
  "students": [
    {
      "id": "student_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@student.edu",
      "matricNumber": "CS/2023/001",
      "joinedAt": "2024-01-10T08:00:00Z",
      "attendanceRate": 84.5,
      "lastAttendance": "2024-01-15T09:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalRecords": 150
  }
}
```

### GET /admin/attendance/today
**Query Parameters:**
- `date`: "2024-01-15" (optional, defaults to today)

**Expected Response:**
```json
{
  "success": true,
  "attendance": [
    {
      "id": "attendance_id",
      "studentName": "John Doe",
      "matricNumber": "CS/2023/001",
      "time": "09:30:00",
      "signatureUrl": "/uploads/signatures/student_id.png"
    }
  ],
  "stats": {
    "totalPresent": 128,
    "totalStudents": 150,
    "attendanceRate": 85.3
  }
}
```

### GET /admin/attendance
**Query Parameters:**
- `date`: "2024-01-15" (required)

**Expected Response:**
```json
{
  "success": true,
  "attendance": [
    {
      "id": "attendance_id", 
      "studentName": "John Doe",
      "matricNumber": "CS/2023/001",
      "time": "09:30:00",
      "signatureUrl": "/uploads/signatures/student_id.png"
    }
  ],
  "date": "2024-01-15",
  "stats": {
    "totalPresent": 128,
    "totalStudents": 150,
    "attendanceRate": 85.3
  }
}
```

### POST /admin/updates
**Request Payload:**
```json
{
  "title": "Important Announcement",
  "content": "Please attend the department meeting tomorrow at 2 PM in Room 101."
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Update posted successfully",
  "update": {
    "id": "update_id",
    "title": "Important Announcement", 
    "content": "Please attend the department meeting tomorrow at 2 PM in Room 101.",
    "createdAt": "2024-01-15T10:00:00Z",
    "author": "Dr. Smith"
  }
}
```

### GET /admin/updates
**Expected Response:**
```json
{
  "success": true,
  "updates": [
    {
      "id": "update_id",
      "title": "Important Announcement",
      "content": "Please attend the department meeting tomorrow",
      "createdAt": "2024-01-15T10:00:00Z",
      "author": "Dr. Smith"
    }
  ]
}
```

### DELETE /admin/updates/:updateId
**Expected Response:**
```json
{
  "success": true,
  "message": "Update deleted successfully"
}
```

### GET /admin/attendance/export
**Query Parameters:**
- `startDate`: "2024-01-01" (required)
- `endDate`: "2024-01-31" (required)
- `format`: "csv|xlsx" (optional, defaults to csv)

**Expected Response:**
- Content-Type: application/octet-stream
- Content-Disposition: attachment; filename="attendance_report.csv"
- Binary file data (CSV or Excel)

## Shared Endpoints

### GET /departments
**Expected Response:**
```json
{
  "success": true,
  "departments": [
    {
      "id": "computer-science",
      "name": "Computer Science",
      "adminId": "admin_id",
      "studentCount": 150,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "electrical-engineering", 
      "name": "Electrical Engineering",
      "adminId": "admin_id_2",
      "studentCount": 120,
      "createdAt": "2024-01-02T00:00:00Z"
    }
  ]
}
```

## Error Response Format

All endpoints should return errors in this format:

```json
{
  "success": false,
  "message": "Error description here",
  "error": "SPECIFIC_ERROR_CODE" // optional
}
```

## Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

## File Upload Notes

- Signature images are sent as base64 data URLs
- Server should convert and store as image files
- Return public URLs for signature access
- Implement proper file validation and size limits

## Database Collections Expected

1. **Users**: Store student/admin data with authentication
2. **Departments**: Store department information
3. **Attendance**: Store daily attendance records with signatures
4. **Updates**: Store department announcements
5. **Signatures**: Store signature file references (or embed in Users)

This documentation covers all 14 endpoints with complete payload structures for production backend implementation.