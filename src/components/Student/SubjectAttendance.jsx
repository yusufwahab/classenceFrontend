import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { studentAPI, profileAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Shared/Navbar';

const SubjectAttendance = () => {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    loadActiveSessions();
    // Clear session notifications when page is visited
    localStorage.setItem('lastSeenSessionTime', new Date().toISOString());
    // Refresh every 30 seconds
    const interval = setInterval(loadActiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActiveSessions = async (showLoading = false) => {
    if (showLoading) setRefreshLoading(true);
    try {
      console.log('Fetching active sessions...');
      console.log('Student token:', localStorage.getItem('token'));
      const response = await studentAPI.getActiveSessions();
      console.log('Active sessions response:', response.data);
      console.log('Response status:', response.status);
      response.data.forEach((session, index) => {
        console.log(`Session ${index + 1}:`, {
          id: session.id,
          subjectName: session.subjectName,
          hasAttended: session.hasAttended,
          startTime: session.startTime,
          endTime: session.endTime
        });
        
        if (session.subjectName === 'MME 105') {
          console.log('🔍 MME 105 DEBUG:', {
            sessionId: session.id,
            hasAttended: session.hasAttended,
            attendanceId: session.attendanceId,
            'Should be true if attendance was marked': 'Check backend logs'
          });
        }
      });
      setActiveSessions(response.data || []);
    } catch (error) {
      console.error('Error loading active sessions:', error);
      console.error('Error details:', error.response);
      setActiveSessions([]);
    } finally {
      setLoading(false);
      if (showLoading) setRefreshLoading(false);
    }
  };

  const markAttendance = async (sessionId) => {
    setLoadingStates(prev => ({ ...prev, [sessionId]: true }));
    setMessage({ type: '', text: '' });
    
    try {
      console.log('🚀 Marking attendance for session:', sessionId);
      
      // Backend will automatically use the signature from user profile
      const response = await studentAPI.markSessionAttendance(sessionId);
      console.log('Attendance marked successfully:', response.data);
      setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      // Refresh sessions to update status
      loadActiveSessions();
    } catch (error) {
      console.error('Attendance marking error:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      
      if (errorMessage.includes('signature') || errorMessage.includes('profile')) {
        setRedirecting(true);
        setMessage({ 
          type: 'error', 
          text: 'Please complete your profile by adding signature first. You will be redirected to the signature page...' 
        });
        setTimeout(() => {
          window.location.href = '/signature-setup';
        }, 3000);
      } else if (errorMessage.includes('duplicate') || errorMessage.includes('already marked') || error.response?.data?.error?.includes('E11000')) {
        setMessage({ 
          type: 'error', 
          text: 'You have already marked attendance for this session' 
        });
        // Refresh sessions to get updated status
        loadActiveSessions();
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold">Subject Attendance</h1>
        <button
          onClick={() => loadActiveSessions(true)}
          disabled={refreshLoading}
          className="btn-gradient text-white px-4 py-2 rounded-lg text-sm min-h-[44px] w-full sm:w-auto"
        >
          {refreshLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : redirecting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Active Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeSessions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Sessions</h3>
            <p className="text-gray-600">There are no active attendance sessions at the moment.</p>
          </div>
        ) : (
          activeSessions.map((session, index) => (
            <div key={session.id || session._id || index} className="bg-white rounded-lg shadow border p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">{session.subjectName}</h3>
                  <p className="text-gray-600 text-sm">{session.subjectCode}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {new Date(session.startTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })} - {new Date(session.endTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    session.hasAttended === true ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {session.hasAttended === true ? 'Present' : getTimeRemaining(session.endTime)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    console.log('Button clicked for session:', session.id, 'hasAttended:', session.hasAttended);
                    markAttendance(session.id);
                  }}
                  disabled={loadingStates[session.id] || session.hasAttended === true}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors min-h-[44px] ${
                    session.hasAttended === true
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'btn-gradient text-white hover:opacity-90'
                  }`}
                >
                  {loadingStates[session.id] ? (
                    'Marking...'
                  ) : session.hasAttended === true ? (
                    'Attendance Marked ✓'
                  ) : (
                    'Mark Attendance'
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default SubjectAttendance;