import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { useAuth } from '../../context/AuthContext';
import { profileAPI, authAPI } from '../../services/api';

const SignatureSetup = () => {
  const [signatureMethod, setSignatureMethod] = useState('draw'); // 'draw' or 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const sigCanvas = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get pending user ID
  const pendingUserId = localStorage.getItem('pendingUserId');

  if (!pendingUserId) {
    navigate('/register');
    return null;
  }

  const handleClear = () => {
    if (signatureMethod === 'draw') {
      sigCanvas.current.clear();
    } else {
      setUploadedImage(null);
    }
    setMessage({ type: '', text: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setMessage({ type: '', text: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    let signatureData = null;

    if (signatureMethod === 'draw') {
      if (sigCanvas.current.isEmpty()) {
        setMessage({ type: 'error', text: 'Please draw your signature first' });
        return;
      }
      signatureData = sigCanvas.current.toDataURL();
    } else {
      if (!uploadedImage) {
        setMessage({ type: 'error', text: 'Please upload your signature image' });
        return;
      }
      signatureData = uploadedImage;
    }

    setLoading(true);

    try {
      // Save signature to backend
      await profileAPI.saveSignature(signatureData);
      
      // Get updated user profile
      const profileResponse = await profileAPI.getProfile();
      const user = profileResponse.data.user;
      
      // Login with complete profile
      login(user, localStorage.getItem('token') || 'temp-token');
      
      // Clear pending user ID
      localStorage.removeItem('pendingUserId');
      
      setMessage({ type: 'success', text: 'Profile completed! Redirecting to dashboard...' });
      setTimeout(() => navigate('/student/dashboard'), 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save signature. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <span className="text-3xl font-bold text-blue-700">Classence</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your signature for attendance marking
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Welcome Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Welcome! Complete your profile.
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Please create your signature below. This will be used for attendance marking.
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-md flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose signature method:
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSignatureMethod('draw')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg border ${
                  signatureMethod === 'draw'
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setSignatureMethod('upload')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg border ${
                  signatureMethod === 'upload'
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Upload Image
              </button>
            </div>
          </div>

          {/* Draw Signature */}
          {signatureMethod === 'draw' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Draw your signature below:
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: 400,
                    height: 150,
                    className: 'signature-canvas w-full h-32 border border-gray-200 rounded'
                  }}
                  backgroundColor="white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use your mouse or finger to draw your signature
              </p>
            </div>
          )}

          {/* Upload Signature */}
          {signatureMethod === 'upload' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your signature image:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedImage ? (
                  <div>
                    <img
                      src={uploadedImage}
                      alt="Uploaded signature"
                      className="max-h-32 mx-auto mb-2 border border-gray-200 rounded"
                    />
                    <p className="text-sm text-green-600">Signature uploaded successfully</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Draw your signature on paper, crop it, and upload here
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG. Max size: 2MB
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureSetup;