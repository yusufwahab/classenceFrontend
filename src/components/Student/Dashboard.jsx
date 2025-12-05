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
    <div className="min-h-screen bg-gray-50">
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

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.departmentName} Department
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Matric Number: {user?.matricNumber}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(new Date())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Status Card */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-lg shadow-sm border p-6 ${
              dashboardData?.todayAttendance?.marked 
                ? 'border-green-200 bg-green-50' 
                : 'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  dashboardData?.todayAttendance?.marked 
                    ? 'bg-green-100' 
                    : 'bg-yellow-100'
                }`}>
                  {dashboardData?.todayAttendance?.marked ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
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
                        className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {dashboardData?.monthlyAttendance || 0} days
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Attendance</p>
                  <p className="text-xl font-semibold text-gray-900">
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