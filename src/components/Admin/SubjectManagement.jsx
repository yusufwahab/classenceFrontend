import { useState, useEffect } from 'react';
import { Plus, Clock, Users, BookOpen, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Shared/Navbar';

const SubjectManagement = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showEditSession, setShowEditSession] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
  });

  const [sessionForm, setSessionForm] = useState({
    subjectId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    loadSubjects();
    loadSessions();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await adminAPI.getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await adminAPI.getAttendanceSessions();
      setSessions(response.data || []);
    } catch (error) {
      console.error('Error loading sessions:', error.response?.status, error.response?.data);
      setSessions([]);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: subjectForm.name,
        code: subjectForm.code
      };
      
      const response = await adminAPI.createSubject(payload);
      console.log('Subject created successfully:', response.data);
      
      setSubjectForm({ name: '', code: '' });
      setShowCreateSubject(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error creating subject:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`Error creating subject: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        subjectId: sessionForm.subjectId,
        startTime: `${sessionForm.date}T${sessionForm.startTime}:00`,
        endTime: `${sessionForm.date}T${sessionForm.endTime}:00`
      };
      console.log('Creating session with payload:', payload);
      console.log('Admin user:', user);
      const response = await adminAPI.createAttendanceSession(payload);
      console.log('Session created successfully:', response.data);
      alert('Attendance session created successfully!');
      setSessionForm({ subjectId: '', date: '', startTime: '', endTime: '' });
      setShowCreateSession(false);
      loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      console.error('Session error response:', error.response?.data);
      alert(`Error creating session: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (sessionId) => {
    if (confirm('Are you sure you want to end this session?')) {
      try {
        await adminAPI.endAttendanceSession(sessionId);
        loadSessions();
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
  };

  const handleEditSession = (session) => {
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    setEditingSession({
      ...session,
      date: startTime.toISOString().split('T')[0],
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5)
    });
    setShowEditSession(true);
  };

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        startTime: `${editingSession.date}T${editingSession.startTime}:00`,
        endTime: `${editingSession.date}T${editingSession.endTime}:00`
      };
      await adminAPI.editAttendanceSession(editingSession.id || editingSession._id, payload);
      alert('Session updated successfully!');
      setShowEditSession(false);
      setEditingSession(null);
      loadSessions();
    } catch (error) {
      console.error('Error updating session:', error);
      alert(`Error updating session: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (confirm('Are you sure you want to delete this session? This will also delete all attendance records for this session.')) {
      try {
        await adminAPI.deleteAttendanceSession(sessionId);
        alert('Session deleted successfully!');
        loadSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert(`Error deleting session: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl sm:text-2xl font-bold">Subject Management</h1>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh page"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowCreateSubject(true)}
            className="btn-gradient text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </button>
          <button
            onClick={() => setShowCreateSession(true)}
            className="btn-gradient text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 min-h-[44px]"
          >
            <Clock className="h-4 w-4" />
            <span>Create Session</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Subjects</h2>
        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Added</h3>
            <p className="text-gray-600 mb-4">Create your first subject to start managing attendance sessions.</p>
            <button
              onClick={() => setShowCreateSubject(true)}
              className="btn-gradient text-white px-6 py-2 rounded-lg"
            >
              Add First Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <div key={subject.id || subject._id || index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center space-x-3 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">{subject.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">Code: {subject.code}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
        <div className="space-y-3">
          {sessions.filter(s => s.isActive).map((session, index) => (
            <div key={session.id || session._id || index} className="relative p-4 border rounded-lg">
              <div className="flex items-center space-x-4 pr-16 sm:pr-0">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium">{session.subjectName} ({session.subjectCode})</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Desktop buttons */}
              <div className="hidden sm:flex absolute top-4 right-4 space-x-2">
                <button
                  onClick={() => handleEditSession(session)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  title="Edit session"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleEndSession(session.id || session._id)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  title="End session"
                >
                  <Clock className="h-3 w-3" />
                  <span>End</span>
                </button>
                <button
                  onClick={() => handleDeleteSession(session.id || session._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  title="Delete session"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
              
              {/* Mobile icons */}
              <div className="sm:hidden absolute bottom-4 right-4 flex space-x-3">
                <button
                  onClick={() => handleEditSession(session)}
                  className="p-1"
                  title="Edit session"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleEndSession(session.id || session._id)}
                  className="p-1"
                  title="End session"
                >
                  <Clock className="h-4 w-4 text-yellow-600" />
                </button>
                <button
                  onClick={() => handleDeleteSession(session.id || session._id)}
                  className="p-1"
                  title="Delete session"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Subject Created Successfully!</h3>
              <p className="text-gray-600 mb-4">Please refresh the page for the new subject to take effect.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-gradient text-white px-4 py-2 rounded-lg flex-1"
                >
                  Refresh Now
                </button>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg flex-1"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Subject Modal */}
      {showCreateSubject && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Create Subject</h3>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <input
                type="text"
                placeholder="Subject Name"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Subject Code"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient text-white px-4 py-2 rounded-lg flex-1"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateSubject(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateSession && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Create Attendance Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <select
                value={sessionForm.subjectId}
                onChange={(e) => setSessionForm({...sessionForm, subjectId: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject, index) => (
                  <option key={subject.id || subject._id || index} value={subject.id || subject._id}>{subject.name}</option>
                ))}
              </select>
              <div className="relative">
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Session Date</label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={sessionForm.startTime}
                  onChange={(e) => setSessionForm({...sessionForm, startTime: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Start Time</label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={sessionForm.endTime}
                  onChange={(e) => setSessionForm({...sessionForm, endTime: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">End Time</label>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient text-white px-4 py-2 rounded-lg flex-1"
                >
                  {loading ? 'Creating...' : 'Create Session'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateSession(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditSession && editingSession && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Edit Session</h3>
            <form onSubmit={handleUpdateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={`${editingSession.subjectName} (${editingSession.subjectCode})`}
                  className="w-full p-3 border rounded-lg bg-gray-100"
                  disabled
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={editingSession.date}
                  onChange={(e) => setEditingSession({...editingSession, date: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Session Date</label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={editingSession.startTime}
                  onChange={(e) => setEditingSession({...editingSession, startTime: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Start Time</label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={editingSession.endTime}
                  onChange={(e) => setEditingSession({...editingSession, endTime: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">End Time</label>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient text-white px-4 py-2 rounded-lg flex-1"
                >
                  {loading ? 'Updating...' : 'Update Session'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditSession(false);
                    setEditingSession(null);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SubjectManagement;