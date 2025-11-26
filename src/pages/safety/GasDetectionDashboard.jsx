import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaBell, FaChartLine } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const GasDetectionDashboard = () => {
  const { user } = useContext(AuthContext);
  const [gasLevels, setGasLevels] = useState({
    methane: { value: 0, safe: true, threshold: 1.0 },
    carbonMonoxide: { value: 0, safe: true, threshold: 50 },
    hydrogen: { value: 0, safe: true, threshold: 4.0 },
    oxygenLow: { value: 21, safe: true, thresholdLow: 19.5 },
    oxygenHigh: { value: 21, safe: true, thresholdHigh: 23.5 }
  });
  const [predictions, setPredictions] = useState({
    riskLevel: 'Low',
    nextHourPrediction: 'Stable conditions expected',
    recommendedActions: ['Continue normal operations', 'Maintain regular monitoring']
  });
  const [alerts, setAlerts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate real-time gas level changes
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        // Simulate random fluctuations in gas levels
        const newGasLevels = { ...gasLevels };
        
        // Methane (CH4) simulation
        const methaneDelta = (Math.random() - 0.5) * 0.3;
        newGasLevels.methane.value = Math.max(0, newGasLevels.methane.value + methaneDelta);
        newGasLevels.methane.safe = newGasLevels.methane.value < newGasLevels.methane.threshold;
        
        // Carbon Monoxide (CO) simulation
        const coDelta = (Math.random() - 0.5) * 5;
        newGasLevels.carbonMonoxide.value = Math.max(0, newGasLevels.carbonMonoxide.value + coDelta);
        newGasLevels.carbonMonoxide.safe = newGasLevels.carbonMonoxide.value < newGasLevels.carbonMonoxide.threshold;
        
        // Hydrogen (H2) simulation
        const h2Delta = (Math.random() - 0.5) * 0.2;
        newGasLevels.hydrogen.value = Math.max(0, newGasLevels.hydrogen.value + h2Delta);
        newGasLevels.hydrogen.safe = newGasLevels.hydrogen.value < newGasLevels.hydrogen.threshold;
        
        // Oxygen (O2) simulation
        const o2Delta = (Math.random() - 0.5) * 0.3;
        const newO2Value = Math.max(15, Math.min(25, newGasLevels.oxygenLow.value + o2Delta));
        newGasLevels.oxygenLow.value = newO2Value;
        newGasLevels.oxygenHigh.value = newO2Value;
        newGasLevels.oxygenLow.safe = newO2Value > newGasLevels.oxygenLow.thresholdLow;
        newGasLevels.oxygenHigh.safe = newO2Value < newGasLevels.oxygenHigh.thresholdHigh;
        
        // Check for unsafe conditions and create alerts
        Object.entries(newGasLevels).forEach(([gasType, data]) => {
          if (!data.safe && Math.random() > 0.7) { // Only create alerts occasionally to avoid spam
            const newAlert = {
              id: Date.now(),
              type: gasType,
              message: `${formatGasName(gasType)} levels are ${data.value.toFixed(2)} - exceeding safe limits!`,
              timestamp: new Date().toISOString(),
              severity: data.value > (data.threshold || data.thresholdHigh || data.thresholdLow) * 1.5 ? 'high' : 'medium'
            };
            setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep only the 10 most recent alerts
            
            // Show toast notification for high severity alerts
            if (newAlert.severity === 'high') {
              toast.error(newAlert.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          }
        });
        
        // Update gas levels
        setGasLevels(newGasLevels);
        
        // Update AI predictions based on current gas levels
        updatePredictions(newGasLevels);
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [isSimulating, gasLevels]);
  
  // Format gas name for display
  const formatGasName = (gasType) => {
    switch(gasType) {
      case 'methane': return 'Methane (CH₄)';
      case 'carbonMonoxide': return 'Carbon Monoxide (CO)';
      case 'hydrogen': return 'Hydrogen (H₂)';
      case 'oxygenLow': 
      case 'oxygenHigh': return 'Oxygen (O₂)';
      default: return gasType;
    }
  };
  
  // Update AI predictions based on gas levels
  const updatePredictions = (gasLevels) => {
    // Count unsafe gas levels
    const unsafeCount = Object.values(gasLevels).filter(gas => !gas.safe).length;
    
    // Determine risk level
    let riskLevel = 'Low';
    let nextHourPrediction = 'Stable conditions expected';
    let recommendedActions = ['Continue normal operations', 'Maintain regular monitoring'];
    
    if (unsafeCount === 1) {
      riskLevel = 'Medium';
      nextHourPrediction = 'Potential for worsening conditions in the next hour';
      recommendedActions = [
        'Increase ventilation in affected areas',
        'Monitor gas levels more frequently',
        'Prepare for possible evacuation if levels continue to rise'
      ];
    } else if (unsafeCount >= 2) {
      riskLevel = 'High';
      nextHourPrediction = 'High probability of dangerous conditions developing';
      recommendedActions = [
        'Begin evacuation procedures immediately',
        'Activate emergency response team',
        'Shut down non-essential operations',
        'Identify source of gas leaks'
      ];
    }
    
    setPredictions({
      riskLevel,
      nextHourPrediction,
      recommendedActions
    });
  };
  
  // Handle emergency alert
  const handleEmergencyAlert = () => {
    // In a real implementation, this would send alerts to all workers and supervisors
    toast.error("🚨 EMERGENCY ALERT SENT TO ALL PERSONNEL!", {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Add to alerts list
    const newAlert = {
      id: Date.now(),
      type: 'emergency',
      message: `Emergency alert triggered by ${user.name}`,
      timestamp: new Date().toISOString(),
      severity: 'high'
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    
    // In a real app, this would call an API endpoint to trigger the alert system
    // api.post('/api/alerts/emergency', { userId: user._id, location: 'Current section' });
  };
  
  // Toggle simulation
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    if (!isSimulating) {
      toast.info("Gas level simulation started", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Real-Time Gas Detection</h1>
        <div className="flex space-x-4">
          <button
            onClick={toggleSimulation}
            className={`px-4 py-2 rounded-lg font-medium ${
              isSimulating 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          <button
            onClick={handleEmergencyAlert}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <FaExclamationTriangle className="mr-2" /> Emergency Alert
          </button>
        </div>
      </div>
      
      {/* Gas Levels Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(gasLevels).map(([gasType, data]) => {
          // Skip duplicate oxygen display
          if (gasType === 'oxygenHigh') return null;
          
          // Determine display value and thresholds
          let displayValue = data.value;
          let threshold = data.threshold;
          let thresholdType = 'max';
          
          // Special case for oxygen which has both min and max thresholds
          if (gasType === 'oxygenLow') {
            threshold = `${data.thresholdLow} - ${gasLevels.oxygenHigh.thresholdHigh}`;
            thresholdType = 'range';
          }
          
          return (
            <motion.div
              key={gasType}
              className={`p-6 rounded-lg shadow-md ${
                data.safe ? 'bg-white' : 'bg-red-100 border-2 border-red-500'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{formatGasName(gasType)}</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-4xl font-bold ${data.safe ? 'text-gray-800' : 'text-red-600'}`}>
                    {displayValue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Safe {thresholdType === 'max' ? 'below' : 'between'}: {threshold}
                  </p>
                </div>
                {!data.safe && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    UNSAFE
                  </div>
                )}
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${data.safe ? 'bg-green-500' : 'bg-red-500'}`}
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: thresholdType === 'max' 
                      ? `${Math.min(100, (data.value / (data.threshold * 1.5)) * 100)}%`
                      : `${Math.min(100, ((data.value - 15) / 10) * 100)}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* AI Predictions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-blue-600 text-2xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">AI-Powered Predictions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Current Risk Level</h3>
            <div className={`text-xl font-bold ${
              predictions.riskLevel === 'Low' ? 'text-green-600' :
              predictions.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {predictions.riskLevel}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Next Hour Forecast</h3>
            <p className="text-gray-800">{predictions.nextHourPrediction}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Recommended Actions</h3>
            <ul className="list-disc pl-5 text-gray-800">
              {predictions.recommendedActions.map((action, index) => (
                <li key={index} className="mb-1">{action}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FaBell className="text-yellow-500 text-2xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Recent Alerts</h2>
        </div>
        
        {alerts.length === 0 ? (
          <p className="text-gray-500 italic">No recent alerts</p>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <motion.div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between">
                  <p className={`font-medium ${
                    alert.severity === 'high' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {alert.message}
                  </p>
                  <span className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GasDetectionDashboard;