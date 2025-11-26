import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import playlistVideos from '../../data/playlistVideos.json';
import api from '../../utils/axiosConfig';

const siteStats = {
  totalUsers: 146,
  promptsSent: 132,
  checklistCompletion: 84,
  activeHazards: 9,
  videoCompletion: 67,
  averageWatch: 82,
  languages: ['English', 'Hindi', 'Odia', 'Marathi'],
};

const hazardQueue = [
  { id: 'HZ-441', type: 'Roof fall risk', location: 'Jharia Seam 5', status: 'Awaiting verification', submittedBy: 'S. Rao' },
  { id: 'HZ-442', type: 'Conveyor pinch point', location: 'Talcher Plant 2', status: 'In mitigation', submittedBy: 'R. Mishra' },
  { id: 'HZ-443', type: 'Blasting signal gap', location: 'Korba Pit 3', status: 'Needs multilingual brief', submittedBy: 'A. Singh' },
];

const contentPipeline = [
  { id: 1, title: 'PPE Compliance (DGMS Circular 05/2024)', source: 'DGMS Advisory', status: 'Scheduled' },
  { id: 2, title: 'MSHA Case Study: Loader entanglement', source: 'MSHA-USA', status: 'Storyboarding' },
  { id: 3, title: '20 years accident-free testimonial', source: 'Experienced Miner', status: 'Editing' },
  { id: 4, title: 'Work Safe Australia blasting best practices', source: 'WorkSafe-AU', status: 'Translation' },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [missedAlerts, setMissedAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const videoOfTheDay = useMemo(() => {
    if (!playlistVideos.length) return null;
    const today = new Date().toISOString().split('T')[0];
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return playlistVideos[hash % playlistVideos.length];
  }, []);

  useEffect(() => {
    const allowedRoles = ['admin', 'supervisor', 'dgms_officer'];
    if (!user || !allowedRoles.includes(user.role)) {
      return;
    }

    let isMounted = true;
    const fetchAlerts = async () => {
      setAlertsLoading(true);
      try {
        const { data } = await api.get('/checklist/missed/open');
        if (isMounted) {
          setMissedAlerts(data?.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch missed checklist alerts:', error);
      } finally {
        if (isMounted) {
          setAlertsLoading(false);
        }
      }
    };

    fetchAlerts();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await api.patch(`/checklist/missed/${alertId}/ack`);
      setMissedAlerts((prev) => prev.filter((alert) => alert._id !== alertId));
    } catch (error) {
      console.error('Failed to acknowledge checklist alert:', error);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8 mt-10"
    >
      <Header userName={user?.name} />

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <SummaryCard color="bg-blue-100 text-blue-600" title="Workforce enrolled" value={siteStats.totalUsers} subtitle="Accounts onboarded" />
        <SummaryCard color="bg-green-100 text-green-600" title="Checklist completion" value={`${siteStats.checklistCompletion}%`} subtitle="DGMS prompts honoured" />
        <SummaryCard color="bg-yellow-100 text-yellow-600" title="Active hazards" value={siteStats.activeHazards} subtitle="Awaiting mitigation" />
        <SummaryCard color="bg-purple-100 text-purple-600" title="Languages live" value={siteStats.languages.length} subtitle={siteStats.languages.join(', ')} />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="glass-card rounded-xl shadow-lg p-8 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 mb-8"
      >
        <SectionHeading title="Daily safety operations" subtitle="Control center for prompts, videos, and hazard closures." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <PromptCoverage />
          <VideoSnapshot />
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8"
      >
        <VideoOfDayCard video={videoOfTheDay} />
        <MissedChecklistAlerts
          alerts={missedAlerts}
          loading={alertsLoading}
          onAcknowledge={handleAcknowledgeAlert}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <HazardOversight />
        <ContentPipeline />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="glass-card rounded-2xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 mb-8"
      >
        <SectionHeading title="Administrative quick links" subtitle="Keep compliance controls close." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <AdminLink to="/user-management" color="from-blue-500 to-blue-600" label="User Management" />
          <AdminLink to="/site-settings" color="from-purple-500 to-purple-600" label="Site Settings" />
          <AdminLink to="/reports" color="from-green-500 to-green-600" label="Compliance Reports" />
          <AdminLink to="/audit-logs" color="from-gray-500 to-gray-600" label="Audit Logs" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const Header = ({ userName }) => (
  <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5">
      <div className="absolute top-0 left-0 w-full h-full" 
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Command Center</h1>
          <p className="text-xl text-white text-opacity-90">
            Namaste, <span className="font-semibold">{userName || 'Admin'}</span>. Track DGMS-aligned adoption.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <HighlightStat label="Role-based prompts" value={siteStats.promptsSent} />
          <HighlightStat label="Videos in pipeline" value={contentPipeline.length} />
        </div>
      </div>
    </motion.div>
  </div>
);

const HighlightStat = ({ label, value }) => (
  <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-center">
    <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const SummaryCard = ({ color, title, value, subtitle }) => (
  <motion.div className="glass-card rounded-xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50">
    <div className="flex items-center mb-3">
      <div className={`p-2 rounded-full mr-3 ${color}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-gray-700 font-medium">{title}</h3>
    </div>
    <p className="text-4xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
  </motion.div>
);

const PromptCoverage = () => (
  <div className="rounded-2xl border border-gray-100 p-6 bg-white shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
      Prompt coverage
    </h3>
    <p className="text-4xl font-bold text-gray-900 mb-2">{siteStats.promptsSent}</p>
    <p className="text-sm text-gray-500">Role-based DGMS checklist nudges issued this shift.</p>
    <div className="mt-5 space-y-3">
      <ProgressLine label="Equipment crew" value={92} />
      <ProgressLine label="Blasting crew" value={78} />
      <ProgressLine label="Processing plant" value={69} />
    </div>
  </div>
);

const VideoSnapshot = () => (
  <div className="rounded-2xl border border-gray-100 p-6 bg-white shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
      Video engagement snapshot
    </h3>
    <ul className="space-y-3 text-sm text-gray-700">
      <li className="flex justify-between"><span>Today’s completions</span><strong>{siteStats.videoCompletion}</strong></li>
      <li className="flex justify-between"><span>Average watch time</span><strong>{siteStats.averageWatch}%</strong></li>
      <li className="flex justify-between"><span>Languages auto-served</span><strong>{siteStats.languages.length}</strong></li>
    </ul>
    <Link
      to="/video-library"
      className="inline-flex items-center mt-5 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
    >
      Review safety content queue
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </Link>
  </div>
);

const ProgressLine = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full h-2 bg-gray-100 rounded-full">
      <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const VideoOfDayCard = ({ video }) => (
  <div className="glass-card rounded-2xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50 xl:col-span-2">
    <SectionHeading title="Safety Video of the Day" subtitle="Auto-curated from DGMS/MSHA best practices." />
    {video ? (
      <>
        <div className="rounded-xl overflow-hidden shadow-md bg-black mt-4">
          <ReactPlayer
            url={video.url}
            width="100%"
            height="320px"
            controls
            light={video.thumbnail}
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{video.description}</p>
          <div className="mt-3 text-xs text-gray-500">
            Source: {video.channel}
          </div>
        </div>
      </>
    ) : (
      <p className="text-gray-500 mt-4">Loading today’s media...</p>
    )}
  </div>
);

const MissedChecklistAlerts = ({ alerts, loading, onAcknowledge }) => (
  <div className="glass-card rounded-2xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50">
    <SectionHeading title="Checklist alerts" subtitle="Workers blocked from entering mine until checklist is done." />
    {loading ? (
      <p className="text-gray-500 mt-4">Loading alerts...</p>
    ) : alerts.length === 0 ? (
      <p className="text-gray-500 mt-4">No pending checklist alerts 🎉</p>
    ) : (
      <div className="mt-4 space-y-4">
        {alerts.map((alert) => (
          <div key={alert._id} className="rounded-xl border border-gray-100 p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">{alert.user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{alert.user?.role}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700">Pending</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{alert.message}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Logged: {new Date(alert.createdAt).toLocaleTimeString()}</span>
              <button
                onClick={() => onAcknowledge(alert._id)}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
              >
                Acknowledge
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const HazardOversight = () => (
  <div className="glass-card rounded-2xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50">
    <SectionHeading title="Hazard oversight" subtitle="Photo / voice reports needing intervention." />
    <div className="mt-4 space-y-4">
      {hazardQueue.map((hazard) => (
        <div key={hazard.id} className="rounded-xl border border-gray-100 p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{hazard.type}</p>
              <p className="text-xs text-gray-500">{hazard.location}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-50 text-yellow-700">{hazard.status}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Submitted by {hazard.submittedBy}</p>
          <div className="mt-3 flex gap-2">
            <button className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">Review media</button>
            <button className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Assign response</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContentPipeline = () => (
  <div className="glass-card rounded-2xl shadow-lg p-6 border border-white border-opacity-20 bg-gradient-to-br from-white to-gray-50">
    <SectionHeading title="Safety content pipeline" subtitle="DGMS advisories, case studies, and testimonials." />
    <div className="mt-4 space-y-4">
      {contentPipeline.map((item) => (
        <div key={item.id} className="rounded-xl border border-gray-100 p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">{item.title}</p>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">{item.status}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Source: {item.source}</p>
        </div>
      ))}
    </div>
  </div>
);

const SectionHeading = ({ title, subtitle }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const AdminLink = ({ to, color, label }) => (
  <Link
    to={to}
    className={`flex items-center justify-between p-4 bg-gradient-to-r ${color} text-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1`}
  >
    <div>
      <p className="font-semibold">{label}</p>
      <p className="text-xs opacity-80">Open module</p>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </Link>
);

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

export default AdminDashboard;

