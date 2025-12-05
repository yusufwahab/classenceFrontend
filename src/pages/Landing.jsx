import { Link } from 'react-router-dom';
import { CheckCircle, Users, Bell, FileText, ArrowRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-blue-700" />,
      title: "Easy Attendance",
      description: "Students mark their presence with a single tap. Quick, simple, and efficient attendance tracking."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-700" />,
      title: "Real-Time Tracking",
      description: "Admins monitor attendance instantly with live statistics and comprehensive reporting tools."
    },
    {
      icon: <Bell className="h-8 w-8 text-blue-700" />,
      title: "Department Updates",
      description: "Broadcast announcements to all department students instantly and keep everyone informed."
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-700" />,
      title: "Digital Records",
      description: "Maintain accurate attendance logs with digital signatures and exportable reports."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Register",
      description: "Create an account as a student or admin"
    },
    {
      number: "2", 
      title: "Access Dashboard",
      description: "Login to your personalized dashboard"
    },
    {
      number: "3",
      title: "Take Action",
      description: "Mark attendance or manage students based on your role"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-700">Classence</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Student Attendance
            <span className="block text-blue-700">Management System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline attendance tracking and department communication for educational institutions with our modern, efficient platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage attendance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make attendance tracking and communication seamless for both students and administrators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="text-2xl font-bold text-blue-400">Classence</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400">
              <div>
                <h4 className="font-semibold text-white mb-2">Contact</h4>
                <p>support@classence.edu</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Legal</h4>
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Support</h4>
                <p>Help Center</p>
                <p>Documentation</p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8">
              <p className="text-gray-400">
                © 2024 Classence. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;