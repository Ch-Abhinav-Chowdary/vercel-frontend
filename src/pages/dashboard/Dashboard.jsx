import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import playlistVideos from '../../data/playlistVideos.json';
import api from '../../utils/axiosConfig';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [videos] = useState(playlistVideos);
  const [stats, setStats] = useState({
    pendingChecklist: false,
    safetyTips: [
      "Always wear appropriate PPE for your task",
      "Report hazards immediately to your supervisor",
      "Stay hydrated during your shift",
      "Check equipment before use",
      "Know your emergency evacuation routes"
    ]
  });

  const missedChecklistRef = useRef(null);

  useEffect(() => {
    // In a real app, we would fetch this data from the backend
    const fetchDashboardData = async () => {
      try {
        // const response = await axios.get('/api/dashboard');
        // setStats(response.data);
        
        // For prototype, we'll use mock data
        setStats(prev => ({
          ...prev,
          pendingChecklist: new Date().getHours() < 12 // Morning = pending checklist
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const shouldNotifyAdmin = stats.pendingChecklist && user?.role === 'worker';
    if (!shouldNotifyAdmin || !user?._id) {
      return;
    }

    const todayKey = new Date().toISOString().split('T')[0];
    if (missedChecklistRef.current === todayKey) {
      return;
    }

    const notifyAdmin = async () => {
      try {
        await api.post('/checklist/missed', {
          userId: user._id,
          reason: 'pre_shift_check'
        });
        missedChecklistRef.current = todayKey;
      } catch (error) {
        console.error('Failed to notify admin about missed checklist:', error);
      }
    };

    notifyAdmin();
  }, [stats.pendingChecklist, user?._id, user?.role]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const videoOfTheDay = useMemo(() => {
    if (!videos.length) return null;
    const today = new Date().toISOString().split('T')[0];
    const hash = today
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return videos[hash % videos.length];
  }, [videos]);

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      {/* Welcome Section with Animated Gradient */}
      <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-white text-opacity-90 text-lg">Your safety dashboard overview</p>
        </motion.div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Daily Checklist Reminder */}
        <motion.div 
          variants={itemVariants}
          className={`glass-card p-6 rounded-xl shadow-lg border border-white border-opacity-20 relative overflow-hidden ${
            stats.pendingChecklist 
              ? 'bg-gradient-to-br from-yellow-50 to-yellow-100' 
              : 'bg-gradient-to-br from-green-50 to-green-100'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-white bg-opacity-30"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-full mr-3 ${
                stats.pendingChecklist 
                  ? 'bg-yellow-200 text-yellow-700' 
                  : 'bg-green-200 text-green-700'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-black">Daily Safety Checklist</h2>
            </div>
            
            {stats.pendingChecklist ? (
              <div>
                <p className="text-gray-700 mb-4">You haven't completed your daily safety checklist yet.</p>
                <a 
                  href="/daily-checklist" 
                  className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition transform hover:scale-105 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Complete Now
                </a>
              </div>
            ) : (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700 font-medium">Great job! You've completed your safety checklist for today.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Safety Tip of the Day */}
        <motion.div 
          variants={itemVariants}
          className="glass-card p-6 rounded-xl shadow-lg border border-white border-opacity-20 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-white bg-opacity-30"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full mr-3 bg-blue-200 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-black">Safety Tip of the Day</h2>
            </div>
            <div className="bg-white bg-opacity-50 p-4 rounded-lg border border-blue-100">
              <p className="text-gray-700 italic">
                "{stats.safetyTips[Math.floor(Math.random() * stats.safetyTips.length)]}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="glass-card p-6 rounded-xl shadow-lg border border-white border-opacity-20 bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-white bg-opacity-30"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full mr-3 bg-purple-200 text-purple-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-black">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <a 
                href="/hazard-reporting" 
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition transform hover:scale-105 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Report Hazard
              </a>
              <a 
                href="/video-library" 
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                View Safety Videos
              </a>
            </div>
          </div>
        </motion.div>

        {/* Video of the Day */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 lg:col-span-3 glass-card p-6 rounded-xl shadow-lg border border-white border-opacity-20 bg-gradient-to-br from-gray-50 to-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full mr-3 bg-red-200 text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">Safety Video of the Day</h2>
              <p className="text-sm text-gray-500">Auto-rotates daily from MSHA playlist</p>
            </div>
          </div>
          {videoOfTheDay ? (
            <>
              <div className="bg-black rounded-xl overflow-hidden shadow-xl">
                <ReactPlayer
                  url={videoOfTheDay.url}
                  width="100%"
                  height="360px"
                  controls
                  light={videoOfTheDay.thumbnail}
                  playing={false}
                />
              </div>
              <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{videoOfTheDay.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{videoOfTheDay.description}</p>
                </div>
                <a 
                  href="/video-library" 
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow"
                >
                  View in library
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Loading today’s safety video…</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;