import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Bell, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import Navbar from '../Shared/Navbar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setMessage({ type: 'error', text: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    setMarkingAttendance(true);
    
    try {
      const response = await studentAPI.markAttendance();
      setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      
      // Check if error is about missing signature
      if (errorMessage.includes('signature') || errorMessage.includes('profile')) {
        setMessage({ 
          type: 'error', 
          text: 'Please complete your profile by adding signature first' 
        });
        // Redirect to signature setup after 2 seconds
        setTimeout(() => {
          window.location.href = '/signature-setup';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setMarkingAttendance(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Premium Welcome Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                {user?.departmentName} Department
              </p>
              <p className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                Matric: {user?.matricNumber}
              </p>
            </div>
            <div className="mt-6 sm:mt-0">
              <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border border-blue-200">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{formatDate(new Date())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Premium Attendance Status Card */}
          <div className="lg:col-span-2">
            <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 p-6 sm:p-8 transition-all duration-300 ${
              dashboardData?.todayAttendance?.marked 
                ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
                : 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50'
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`p-4 rounded-2xl shadow-lg ${
                  dashboardData?.todayAttendance?.marked 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                    : 'bg-gradient-to-br from-amber-100 to-yellow-100'
                }`}>
                  {dashboardData?.todayAttendance?.marked ? (
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-10 w-10 text-amber-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Today's Attendance
                  </h3>
                  
                  {dashboardData?.todayAttendance?.marked ? (
                    <div>
                      <p className="text-green-700 font-medium mb-1">
                        ✓ Attendance marked successfully
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <Clock className="h-4 w-4" />
                        <span>Marked at {dashboardData.todayAttendance.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-yellow-700 font-medium mb-3">
                        You haven't marked attendance today
                      </p>
                      <button
                        onClick={handleMarkAttendance}
                        disabled={markingAttendance}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                      >
                        {markingAttendance ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Marking...</span>
                          </div>
                        ) : (
                          'Mark Attendance Now'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">This Month</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {dashboardData?.monthlyAttendance || 0} days
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl shadow-lg">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Total Attendance</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {dashboardData?.totalAttendance || 0} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Recent Department Updates</span>
                </h2>
                <a
                  href="/student/updates"
                  className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                >
                  View All Updates →
                </a>
              </div>
            </div>
            
            <div className="p-6">
              {dashboardData?.recentUpdates?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentUpdates.slice(0, 3).map((update) => (
                    <div key={update.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {update.title}
                      </h3>
                      {update.content && (
                        <p className="text-gray-600 text-sm mb-2">
                          {update.content.length > 100 
                            ? `${update.content.substring(0, 100)}...` 
                            : update.content
                          }
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By: {update.createdBy?.firstName} {update.createdBy?.lastName}</span>
                        <span>•</span>
                        <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No announcements yet</p>
                  <p className="text-sm text-gray-400">Check back later for updates from your department</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;