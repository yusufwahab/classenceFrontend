import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SignatureSetup from './components/Auth/SignatureSetup';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Student Components
import StudentDashboard from './components/Student/Dashboard';
import StudentUpdates from './components/Student/Updates';
import AttendanceLog from './components/Student/AttendanceLog';

// Admin Components
import AdminDashboard from './components/Admin/Dashboard';
import AdminAttendanceView from './components/Admin/AttendanceView';
import AdminStudents from './components/Admin/Students';
import PostUpdate from './components/Admin/PostUpdate';
import ManageUpdates from './components/Admin/ManageUpdates';
import AdminReports from './components/Admin/Reports';
import SubjectManagement from './components/Admin/SubjectManagement';
import SubjectAttendance from './components/Student/SubjectAttendance';



const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Register />} />
      <Route path="/signature-setup" element={<SignatureSetup />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute role="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/updates" element={
        <ProtectedRoute role="student">
          <StudentUpdates />
        </ProtectedRoute>
      } />
      <Route path="/student/attendance-log" element={
        <ProtectedRoute role="student">
          <AttendanceLog />
        </ProtectedRoute>
      } />
      <Route path="/student/subject-attendance" element={
        <ProtectedRoute role="student">
          <SubjectAttendance />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute role="admin">
          <AdminStudents />
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute role="admin">
          <AdminAttendanceView />
        </ProtectedRoute>
      } />
      <Route path="/admin/post-update" element={
        <ProtectedRoute role="admin">
          <PostUpdate />
        </ProtectedRoute>
      } />
      <Route path="/admin/manage-updates" element={
        <ProtectedRoute role="admin">
          <ManageUpdates />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute role="admin">
          <AdminReports />
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects" element={
        <ProtectedRoute role="admin">
          <SubjectManagement />
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;