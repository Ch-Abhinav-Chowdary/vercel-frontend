import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className={`max-w-3xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Mine Safety <span className="text-secondary-300">Companion</span>
            </h1>
            <div className="h-1 w-24 bg-secondary-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl mb-10 font-heading text-gray-100">
              Enhancing safety in mining operations through innovative digital solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-primary-700 font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-5 px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Key Features</h2>
          <div className="h-1 w-16 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-heading">
            Our comprehensive platform offers powerful tools to enhance safety in mining operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Daily Safety Checklists",
              description: "Role-specific safety checklists to ensure compliance with safety protocols before each shift.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )
            },
            {
              title: "Hazard Reporting",
              description: "Quick and easy hazard reporting system to identify and address safety concerns promptly.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )
            },
            {
              title: "Safety Training Videos",
              description: "Access to a library of safety training videos to improve awareness and knowledge.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-50"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-300 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto glass-card p-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">About Mine Safety Companion</h2>
              <div className="h-1 w-16 bg-primary-500 mx-auto mb-6"></div>
            </div>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Mine Safety Companion is a comprehensive digital solution designed to enhance safety in mining operations. 
              Our platform provides tools for safety compliance, hazard reporting, and safety training to create a safer 
              working environment for all mining personnel.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              With role-based dashboards for workers, supervisors, and administrators, Mine Safety Companion ensures 
              that everyone has access to the tools and information they need to maintain safety standards and respond 
              effectively to potential hazards.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to enhance safety at your mine?</h2>
            <p className="text-xl mb-8 text-gray-100">
              Join thousands of mining professionals who trust Mine Safety Companion
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-primary-700 font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">Mine Safety Companion</h3>
              <p className="text-gray-400 mb-6">Enhancing safety in mining operations through innovative digital solutions</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-400">123 Mining Way, Safety City, SC 12345</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-400">contact@minesafetycompanion.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Mine Safety Companion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;