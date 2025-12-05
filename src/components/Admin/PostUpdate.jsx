import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertCircle, Image, Mic, MicOff, Play, Pause, Square, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import Navbar from '../Shared/Navbar';

const PostUpdate = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    audio: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target.result;
          setFormData({ ...formData, audio: base64String });
          setAudioPreview(base64String);
        };
        reader.readAsDataURL(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Could not access microphone' });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type) => {
    setFormData({ ...formData, [type]: null });
    if (type === 'image') setImagePreview(null);
    if (type === 'audio') setAudioPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }
    
    // Only title is required - content, image, and audio are all optional

    setLoading(true);
    
    const payload = { title: formData.title };
    
    if (formData.content && formData.content.trim()) {
      payload.content = formData.content;
    }
    
    if (formData.image && formData.image.startsWith('data:image/')) {
      payload.imageUrl = formData.image;
    }
    
    if (formData.audio && formData.audio.startsWith('data:audio/')) {
      payload.audioUrl = formData.audio;
    }
    

    
    try {
      await adminAPI.postUpdate(payload);
      
      setMessage({ type: 'success', text: 'Update posted successfully!' });
      setFormData({ title: '', content: '', image: null, audio: null });
      setImagePreview(null);
      setAudioPreview(null);
      
      setTimeout(() => {
        navigate('/admin/manage-updates', { replace: true });
      }, 1500);
    } catch (error) {

      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.response?.data?.error || 'Failed to post update. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/manage-updates');
  };

  const titleCharCount = formData.title.length;
  const contentCharCount = formData.content.length;
  const maxTitleLength = 100;
  const maxContentLength = 1000;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
            <span className="mx-2">›</span>
            <a href="/admin/manage-updates" className="hover:text-blue-600">Manage Updates</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Post New Update</span>
          </nav>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <span>Post New Update</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Share announcements with all students in your department
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Update Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Update title..."
                maxLength={maxTitleLength}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">Enter a clear, descriptive title for your announcement</p>
                <span className={`text-xs ${titleCharCount > maxTitleLength * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                  {titleCharCount}/{maxTitleLength}
                </span>
              </div>
            </div>

            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Update Content (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your announcement here..."
                  maxLength={maxContentLength}
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Add image"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title={isRecording ? (isPaused ? 'Resume recording' : 'Pause recording') : 'Start recording'}
                  >
                    {isRecording ? (isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />) : <Mic className="h-5 w-5" />}
                  </button>
                  {isRecording && (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Stop recording"
                    >
                      <Square className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  {isRecording ? (isPaused ? 'Recording paused' : 'Recording...') : 'Add text, image, or audio'}
                </p>
                <span className={`text-xs ${contentCharCount > maxContentLength * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                  {contentCharCount}/{maxContentLength}
                </span>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* Media Preview */}
            {(imagePreview || audioPreview) && (
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-w-xs h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeFile('image')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {audioPreview && (
                  <div className="relative">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <audio controls className="flex-1">
                        <source src={audioPreview} />
                      </audio>
                      <button
                        type="button"
                        onClick={() => removeFile('audio')}
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview */}
            {(formData.title || formData.content || imagePreview || audioPreview) && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  {formData.title && (
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {formData.title}
                    </h4>
                  )}
                  {formData.content && (
                    <p className="text-gray-700 whitespace-pre-wrap mb-3">
                      {formData.content}
                    </p>
                  )}
                  {imagePreview && (
                    <div className="mb-3">
                      <img src={imagePreview} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                  {audioPreview && (
                    <div className="mb-3">
                      <audio controls className="w-full">
                        <source src={audioPreview} />
                      </audio>
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-500">
                      Posted by: {user.firstName} {user.lastName} • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="flex-1 sm:flex-none sm:px-8 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Posting...</span>
                  </div>
                ) : (
                  'Post Update'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none sm:px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostUpdate;