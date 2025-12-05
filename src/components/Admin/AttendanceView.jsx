import { useState, useEffect } from 'react';
import { Calendar, Users, Download, Filter, Eye } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Navbar from '../Shared/Navbar';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';

const AdminAttendanceView = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSignature, setSelectedSignature] = useState(null);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate]);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await adminAPI.getTodayAttendance();
      console.log('Attendance response:', response.data);
      const records = response.data.attendanceRecords || response.data.attendance || [];
      console.log('Attendance records:', records);
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get department name from user context or attendance records
    const departmentName = user?.department || 
      (attendanceRecords.length > 0 ? attendanceRecords[0].department : null) || 
      'Metallurgical and Materials Engineering';
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Attendance Record Sheet', 105, 20, { align: 'center' });
    
    // Department (left side)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Department: ${departmentName}`, 20, 40);
    
    // Date (right side)
    doc.text(`Date: ${currentDate}`, 150, 40);
    
    // Table headers
    const startY = 60;
    const rowHeight = 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Draw table headers
    doc.text('S/N', 20, startY);
    doc.text('Name', 40, startY);
    doc.text('Matric Number', 100, startY);
    doc.text('Signature', 150, startY);
    
    // Draw header line
    doc.line(15, startY + 3, 195, startY + 3);
    
    // Table data with signatures
    doc.setFont('helvetica', 'normal');
    
    for (let index = 0; index < attendanceRecords.length; index++) {
      const record = attendanceRecords[index];
      const yPos = startY + 10 + (index * rowHeight);
      
      doc.text((index + 1).toString(), 20, yPos);
      doc.text(record.name || '', 40, yPos);
      doc.text(record.matricNumber || '', 100, yPos);
      
      // Add signature image if available
      const signatureData = record.signatureImage || record.signature;
      if (signatureData && signatureData.startsWith('data:image/')) {
        try {
          doc.addImage(signatureData, 'PNG', 150, yPos - 8, 30, 12);
        } catch (error) {
          console.log('Error adding signature image:', error);
          doc.text('_________________', 150, yPos);
        }
      } else {
        doc.text('_________________', 150, yPos);
      }
      
      // Draw row separator line
      if (index < attendanceRecords.length - 1) {
        doc.line(15, yPos + 8, 195, yPos + 8);
      }
    }
    
    // Final bottom line
    const finalY = startY + 10 + (attendanceRecords.length * rowHeight);
    doc.line(15, finalY, 195, finalY);
    
    // Save the PDF
    const fileName = `Attendance_Record_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const viewSignature = (signature) => {
    setSelectedSignature(signature);
  };

  const closeSignatureModal = () => {
    setSelectedSignature(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Attendance Records</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
                <span>Attendance Records</span>
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage student attendance with digital signatures
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                {attendanceRecords.length} student{attendanceRecords.length !== 1 ? 's' : ''} present
              </div>
            </div>
            
            <button
              onClick={handleExportPDF}
              disabled={loading || attendanceRecords.length === 0}
              className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : attendanceRecords.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S/N
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matric Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Signature
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceRecords.map((record, index) => (
                      <tr key={record.studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.matricNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => viewSignature(record.signatureImage || record.signature)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <img
                              src={record.signatureImage || record.signature}
                              alt="Signature"
                              style={{
                                maxWidth: '100px',
                                height: '50px',
                                border: '1px solid #ccc',
                                objectFit: 'contain'
                              }}
                              onError={(e) => {
                                console.log('Signature load error for record:', record);
                                console.log('Signature data:', record.signatureImage || record.signature);
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA2NCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUI5QjlCIj5ObyBTaWduYXR1cmU8L3RleHQ+Cjwvc3ZnPgo=';
                              }}
                              onLoad={() => {
                                console.log('Signature loaded successfully for:', record.name);
                              }}
                            />
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(record.timeIn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                <div className="p-4 space-y-4">
                  {attendanceRecords.map((record, index) => (
                    <div key={record.studentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                        <span className="text-sm text-gray-500">{formatTime(record.timeIn)}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{record.name}</p>
                          <p className="text-sm text-gray-500">{record.matricNumber}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Signature:</span>
                          <button
                            onClick={() => viewSignature(record.signature)}
                            className="flex items-center space-x-2 text-blue-600"
                          >
                            <img
                              src={record.signature}
                              alt="Signature"
                              className="h-6 w-12 object-contain border border-gray-200 rounded"
                            />
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No attendance records for this date
              </h3>
              <p className="text-gray-500">
                Students haven't marked attendance for {new Date(selectedDate).toLocaleDateString()} yet.
              </p>
            </div>
          )}
        </div>

        {/* Signature Modal */}
        {selectedSignature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Student Signature</h3>
                <button
                  onClick={closeSignatureModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={selectedSignature}
                  alt="Student Signature"
                  className="w-full h-32 object-contain"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeSignatureModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendanceView;