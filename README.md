# Classence - Student Attendance Management System

A modern, responsive React-based web application for managing student attendance and department communications. Built with React, Tailwind CSS, and designed with a mobile-first approach.

## Features

### For Students
- **Easy Registration**: Register with personal details and select department
- **One-Click Attendance**: Mark attendance with a single tap
- **Department Updates**: View announcements from department administrators
- **Attendance History**: Track personal attendance records with filtering
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### For Administrators
- **Department Creation**: Create new departments with admin code
- **Student Management**: View and manage department students
- **Attendance Tracking**: Monitor real-time attendance statistics
- **Announcements**: Post updates for department students
- **Reports**: Export attendance data (coming soon)

## Design Philosophy

- **Premium & Professional**: Clean, modern interface with institutional feel
- **Single Color Theme**: Deep Blue (#1E40AF) for consistency
- **Mobile-First**: Responsive design prioritizing mobile experience
- **Minimalist**: Clean layouts with plenty of white space

## Tech Stack

- **Frontend**: React 19, React Router DOM
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running (MongoDB + Express)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd classence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your backend URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Student/
│   │   ├── Dashboard.jsx
│   │   ├── Updates.jsx
│   │   └── AttendanceLog.jsx
│   ├── Admin/
│   │   └── Dashboard.jsx
│   └── Shared/
│       ├── Navbar.jsx
│       ├── LoadingSpinner.jsx
│       └── ErrorMessage.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── pages/
│   └── Landing.jsx
└── App.jsx
```

## User Flows

### Student Journey
1. **Registration**: Register with name, matric number, email, and select department
2. **Login**: Access student dashboard
3. **Mark Attendance**: One-click attendance marking
4. **View Updates**: Read department announcements
5. **Check History**: Review attendance log with filtering

### Admin Journey
1. **Registration**: Create department with admin code
2. **Login**: Access admin dashboard
3. **Monitor**: View attendance statistics and student activity
4. **Communicate**: Post updates for department students
5. **Manage**: Oversee student records and attendance

## API Integration

The frontend connects to a MongoDB-based backend with the following endpoints:

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/register-admin` - Admin registration + department creation
- `POST /api/auth/login` - User authentication

### Student Endpoints
- `GET /api/student/dashboard` - Dashboard data
- `POST /api/student/attendance` - Mark attendance
- `GET /api/student/updates` - Department updates
- `GET /api/student/attendance-log` - Attendance history

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/students` - Department students
- `POST /api/admin/updates` - Post announcements

### Shared
- `GET /api/departments` - Available departments

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px
- **Laptop**: 769px - 1024px
- **Desktop**: 1025px+

### Mobile Features
- Hamburger navigation menu
- Touch-friendly buttons (44px minimum)
- Stacked layouts on small screens
- Optimized form inputs
- Swipe-friendly cards

## Color Scheme

- **Primary**: Deep Blue (#1E40AF)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray Scale**: Various shades for text and backgrounds

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Use functional components with hooks
- Follow React best practices
- Maintain consistent Tailwind class ordering
- Use semantic HTML elements
- Implement proper error handling

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service (Netlify, Vercel, etc.)

3. **Configure environment variables** on your hosting platform

## Backend Requirements

The frontend expects a backend with:
- MongoDB database with User, Department, Attendance, and Update collections
- JWT authentication
- CORS enabled for frontend domain
- Proper error handling and validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile and desktop
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@classence.edu
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

Built with ❤️ for educational institutions worldwide.