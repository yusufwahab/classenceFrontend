import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newSessionsCount, setNewSessionsCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Subject Attendance', path: '/student/subject-attendance' },
    { name: 'Updates', path: '/student/updates' },
    { name: 'Attendance Log', path: '/student/attendance-log' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Attendance', path: '/admin/attendance' },
    { name: 'Subjects', path: '/admin/subjects' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Updates', path: '/admin/manage-updates' },
    { name: 'Reports', path: '/admin/reports' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  useEffect(() => {
    if (user?.role === 'student') {
      checkUnreadUpdates();
      checkNewSessions();
    }
  }, [user]);

  const checkUnreadUpdates = async () => {
    try {
      const response = await studentAPI.getUpdates();
      const updates = response.data;
      const lastSeenTime = localStorage.getItem('lastSeenUpdateTime');
      
      if (updates.length > 0) {
        const unreadUpdates = lastSeenTime 
          ? updates.filter(update => new Date(update.createdAt) > new Date(lastSeenTime))
          : updates;
        setUnreadCount(unreadUpdates.length);
      }
    } catch (error) {
      console.error('Error checking unread updates:', error);
    }
  };

  const handleUpdatesClick = () => {
    localStorage.setItem('lastSeenUpdateTime', new Date().toISOString());
    setUnreadCount(0);
  };

  const checkNewSessions = async () => {
    try {
      const response = await studentAPI.getActiveSessions();
      const sessions = response.data;
      const lastSeenSessionTime = localStorage.getItem('lastSeenSessionTime');
      
      if (sessions.length > 0) {
        const newSessions = lastSeenSessionTime 
          ? sessions.filter(session => new Date(session.createdAt) > new Date(lastSeenSessionTime))
          : sessions;
        setNewSessionsCount(newSessions.length);
      }
    } catch (error) {
      console.error('Error checking new sessions:', error);
    }
  };

  const handleSessionsClick = () => {
    localStorage.setItem('lastSeenSessionTime', new Date().toISOString());
    setNewSessionsCount(0);
  };

  const totalNotifications = unreadCount + newSessionsCount;

  return (
    <nav className="navbar-bg backdrop-blur-lg shadow-xl border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Premium Logo */}
          <Link to={user ? `/${user.role}/dashboard` : '/'} className="flex items-center">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              Classence
            </span>
          </Link>

          {/* Premium Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => {
              const isUpdates = link.name === 'Updates';
              const isSubjectAttendance = link.name === 'Subject Attendance';
              const showNotification = (isUpdates && unreadCount > 0) || (isSubjectAttendance && newSessionsCount > 0);
              const notificationCount = isUpdates ? unreadCount : newSessionsCount;
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={isUpdates ? handleUpdatesClick : isSubjectAttendance ? handleSessionsClick : undefined}
                  className="text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 relative"
                >
                  {link.name}
                  {showNotification && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Premium User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
              <div className="p-1 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-blue-600 font-medium">{user?.departmentName}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-200 hover:text-red-400 hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Premium Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white hover:bg-white/10 p-3 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center relative"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalNotifications > 9 ? '9+' : totalNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Premium Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
            <div className="space-y-3">
              {links.map((link) => {
                const isUpdates = link.name === 'Updates';
                const isSubjectAttendance = link.name === 'Subject Attendance';
                const showNotification = (isUpdates && unreadCount > 0) || (isSubjectAttendance && newSessionsCount > 0);
                const notificationCount = isUpdates ? unreadCount : newSessionsCount;
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium min-h-[44px] flex items-center relative"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (isUpdates) handleUpdatesClick();
                      if (isSubjectAttendance) handleSessionsClick();
                    }}
                  >
                    {link.name}
                    {showNotification && (
                      <span className="absolute top-2 right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="border-t border-blue-200 pt-4 mt-4">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-blue-600 font-medium">{user?.departmentName}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center space-x-3 font-medium min-h-[44px]"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;