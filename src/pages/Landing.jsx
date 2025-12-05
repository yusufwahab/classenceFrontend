import { Link } from 'react-router-dom';
import { CheckCircle, Users, Bell, FileText, ArrowRight, Github, Linkedin, Twitter, Mail, Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 icon-gradient" />,
      title: "Easy Attendance",
      description: "Students mark their presence with a single tap. Quick, simple, and efficient attendance tracking."
    },
    {
      icon: <Users className="h-8 w-8 icon-gradient" />,
      title: "Real-Time Tracking",
      description: "Admins monitor attendance instantly with live statistics and comprehensive reporting tools."
    },
    {
      icon: <Bell className="h-8 w-8 icon-gradient" />,
      title: "Department Updates",
      description: "Broadcast announcements to all department students instantly and keep everyone informed."
    },
    {
      icon: <FileText className="h-8 w-8 icon-gradient" />,
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
      <header className="navbar-bg shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-2xl sm:text-3xl font-bold text-white">Classence</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="text-gray-200 hover:text-white px-4 py-2 text-base font-semibold transition-colors rounded-lg hover:bg-white/10"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-200 hover:text-white px-4 py-2 text-base font-semibold transition-colors rounded-lg hover:bg-white/10"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-200 hover:text-white px-4 py-2 text-base font-semibold transition-colors rounded-lg hover:bg-white/10"
              >
                Contact
              </a>
              <Link
                to="/login"
                className="text-gray-200 hover:text-white px-4 py-2 text-base font-semibold transition-colors rounded-lg hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-700 px-6 py-3 rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                Get Started
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-blue-100 py-4">
              <div className="space-y-3">
                <a
                  href="#features"
                  className="block w-full text-center py-3 px-4 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="block w-full text-center py-3 px-4 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="block w-full text-center py-3 px-4 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <Link
                  to="/login"
                  className="block w-full text-center py-3 px-4 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-3 px-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Premium Hero Section */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-blue-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-blue-500">
            Student Attendance
            <br />
            Management System
          </h1>
          
          {/* Subtitle and Button */}
          <div className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
            <p className="mb-4">
              Transform how educational institutions track attendance and manage communications with our comprehensive digital platform designed for modern learning environments.
            </p>
            <p className="font-semibold text-blue-500 mb-6">
              Simple. Secure. Efficient.
            </p>
            <Link
              to="/register"
              className="btn-gradient text-white px-10 py-5 rounded-2xl text-lg font-bold hover:opacity-90 transition-opacity shadow-lg inline-flex items-center"
            >
              Get Started Free
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
          

            </div>
            
            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/StudentAtdImg.png" 
                  alt="Student Attendance Management" 
                  className="w-full max-w-lg h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
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
                    <h3 className="text-xl font-semibold mb-2" style={{background: 'linear-gradient(135deg, #111827 0%, #1e3a8a 50%, #312e81 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
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
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 btn-gradient text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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

      {/* Premium Footer */}
      <footer id="contact" className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  Classence
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Modern student attendance management system designed for educational institutions. Streamline your attendance tracking with our innovative platform.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://github.com/yusufwahab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <Github className="h-6 w-6 text-white" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abdulwahab-yusuf-285703265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <Linkedin className="h-6 w-6 text-white" />
                </a>
                <a
                  href="https://x.com/abdulwahab2504"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <Twitter className="h-6 w-6 text-white" />
                </a>
              </div>
            </div>
            
            {/* Contact Section */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold mb-6 footer-white">Get in Touch</h4>
              <div className="space-y-4">
                <a
                  href="mailto:yabvil25@gmail.com"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="font-medium">yabvil25@gmail.com</span>
                </a>
                <a
                  href="tel:07012507986"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="font-medium">07012507986</span>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold mb-6 footer-white">Quick Links</h4>
              <div className="space-y-3">
                <Link to="/register" className="block text-gray-300 hover:text-white transition-colors font-medium">
                  Get Started
                </Link>
                <Link to="/login" className="block text-gray-300 hover:text-white transition-colors font-medium">
                  Sign In
                </Link>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors font-medium">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-gray-300 text-sm sm:text-base">
                © 2026 Classence. All rights reserved. Built with ❤️ for educational institutions.
              </p>
              <p className="text-gray-400 text-sm">
                Developed by Abdulwahab Yusuf
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;