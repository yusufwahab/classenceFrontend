import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Shared/Navbar';

const SubjectAttendance = () => {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadActiveSessions();
    // Clear session notifications when page is visited
    localStorage.setItem('lastSeenSessionTime', new Date().toISOString());
    // Refresh every 30 seconds
    const interval = setInterval(loadActiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActiveSessions = async () => {
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
    }
  };

  const markAttendance = async (sessionId) => {
    setLoadingStates(prev => ({ ...prev, [sessionId]: true }));
    setMessage({ type: '', text: '' });
    
    try {
      // Backend expects empty payload - student info comes from JWT token
      const payload = {};
      
      console.log('🔍 === DEEP ATTENDANCE DEBUGGING ===');
      console.log('1. Student Info:', {
        id: user?.id,
        name: `${user?.firstName} ${user?.lastName}`,
        matricNumber: user?.matricNumber,
        departmentId: user?.departmentId
      });
      
      console.log('2. Session Info:', {
        sessionId: sessionId,
        subjectName: activeSessions.find(s => s.id === sessionId)?.subjectName,
        hasAttended: activeSessions.find(s => s.id === sessionId)?.hasAttended
      });
      
      console.log('3. Signature Check:', {
        signatureExists: !!localStorage.getItem('userSignature'),
        signatureLength: localStorage.getItem('userSignature')?.length || 0,
        signaturePreview: localStorage.getItem('userSignature')?.substring(0, 50) + '...'
      });
      
      console.log('4. Payload being sent:', payload);
      console.log('5. API URL:', `/subject-attendance/mark/${sessionId}`);
      console.log('6. Authorization header:', `Bearer ${localStorage.getItem('token')?.substring(0, 20)}...`);
      
      console.log('🚀 Making API call now...');
      
      const response = await studentAPI.markSessionAttendance(sessionId, payload);
      console.log('Attendance marked successfully:', response.data);
      setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      // Refresh sessions to update status
      loadActiveSessions();
    } catch (error) {
      console.error('Attendance marking error:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      
      if (errorMessage.includes('signature') || errorMessage.includes('profile')) {
        setMessage({ 
          type: 'error', 
          text: 'Please complete your profile by adding signature first' 
        });
        setTimeout(() => {
          window.location.href = '/signature-setup';
        }, 2000);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold">Subject Attendance</h1>
        <button
          onClick={loadActiveSessions}
          className="btn-gradient text-white px-4 py-2 rounded-lg text-sm min-h-[44px] w-full sm:w-auto"
        >
          Refresh
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
                    {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
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
                  disabled={loadingStates[session.id] || session.hasAttended === true || new Date() > new Date(session.endTime)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors min-h-[44px] ${
                    session.hasAttended === true
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : new Date() > new Date(session.endTime)
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'btn-gradient text-white hover:opacity-90'
                  }`}
                >
                  {loadingStates[session.id] ? (
                    'Marking...'
                  ) : session.hasAttended === true ? (
                    'Attendance Marked ✓'
                  ) : new Date() > new Date(session.endTime) ? (
                    'Session Expired'
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