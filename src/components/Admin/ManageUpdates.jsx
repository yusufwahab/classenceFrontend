import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Navbar from '../Shared/Navbar';

const ManageUpdates = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await adminAPI.getUpdates();
      const updatesData = response.data || [];

      // Sort by most recent first
      const sortedUpdates = updatesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUpdates(sortedUpdates);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = (update) => {
    navigate('/admin/post-update', { state: { update } });
  };

  const handleDeleteClick = (update) => {
    setUpdateToDelete(update);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminAPI.deleteUpdate(updateToDelete._id || updateToDelete.id);
      setShowDeleteModal(false);
      setUpdateToDelete(null);
      fetchUpdates();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to delete update:', error);
      alert('Failed to delete update. Please try again.');
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUpdateToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Manage Updates</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Bell className="h-8 w-8 text-blue-600" />
                <span>Manage Updates</span>
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage all department announcements
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <a
                href="/admin/post-update"
                className="inline-flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Post New Update</span>
              </a>
            </div>
          </div>
        </div>

        {/* Updates List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : updates.length > 0 ? (
            updates.map((update) => (
              <div key={update._id || update.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bell className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            {update.title}
                          </h2>
                          
                          <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                            <p className="whitespace-pre-wrap">{update.content}</p>
                            
                            {/* Media Display Grid */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Image Section */}
                              {update.imageUrl ? (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Image</h4>
                                  <img 
                                    src={update.imageUrl} 
                                    alt="Update image" 
                                    className="w-full h-32 object-cover rounded-lg border" 
                                    onError={(e) => {
                                      console.error('Image failed to load:', update.imageUrl);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : null}
                              
                              {/* Audio Section */}
                              {update.audioUrl && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Audio</h4>
                                  <audio controls className="w-full">
                                    <source src={update.audioUrl} />
                                  </audio>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>
                                  Posted by: {update.createdBy?.firstName || update.author?.firstName || 'Admin'} {update.createdBy?.lastName || update.author?.lastName || ''}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(update.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(update)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit update"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(update)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete update"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No updates posted yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Share your first announcement with students in your department. Keep them informed about important news and updates.
              </p>
              <a
                href="/admin/post-update"
                className="inline-flex items-center space-x-2 bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Post Your First Update</span>
              </a>
            </div>
          )}
        </div>

        {/* Summary */}
        {updates.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {updates.length} update{updates.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Update</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this update? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Update Deleted</h3>
              <p className="text-gray-600 mb-6">The update has been deleted successfully.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUpdates;