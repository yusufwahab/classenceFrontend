import { useState, useEffect } from 'react';
import { Bell, Search, Calendar, User } from 'lucide-react';
import { studentAPI } from '../../services/api';
import Navbar from '../Shared/Navbar';

const StudentUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await studentAPI.getUpdates();
      setUpdates(response.data);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUpdates = updates.filter(update =>
    update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/student/dashboard" className="hover:text-blue-600">Dashboard</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Updates</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Bell className="h-8 w-8 text-blue-600" />
                <span>Department Announcements</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Stay updated with the latest news and announcements from your department
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Updates List */}
        <div className="space-y-6">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update, index) => (
              <div key={update.id || update._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bell className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {update.title}
                        </h2>
                      </div>
                      
                      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                        <p className="whitespace-pre-wrap">{update.content}</p>
                        
                        {/* Media Display Grid */}
                        {(update.imageUrl || update.image || update.audioUrl || update.audio) && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Image Section */}
                            {(update.imageUrl || update.image) && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Image</h4>
                                <img 
                                  src={update.imageUrl || update.image} 
                                  alt="Update image" 
                                  className="w-full h-32 object-cover rounded-lg border" 
                                  onError={(e) => {
                                    console.error('Image failed to load:', update.imageUrl || update.image);
                                    e.target.style.display = 'none';
                                  }}
                                  onLoad={() => console.log('Image loaded successfully')}
                                />
                              </div>
                            )}
                            
                            {/* Audio Section */}
                            {(update.audioUrl || update.audio) && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Audio</h4>
                                <audio controls className="w-full">
                                  <source src={update.audioUrl || update.audio} />
                                </audio>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>
                              Posted by: {update.createdBy?.firstName} {update.createdBy?.lastName}
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
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching announcements' : 'No announcements yet'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Check back later for updates and announcements from your department administrators.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Load More (if needed) */}
        {filteredUpdates.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredUpdates.length} announcement{filteredUpdates.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentUpdates;