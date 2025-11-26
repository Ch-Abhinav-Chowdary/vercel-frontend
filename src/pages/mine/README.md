# 3D Mine Visualization

## Overview
The 3D Mine Visualization is an advanced feature that provides real-time, interactive 3D visualization of the mine structure, worker locations, and danger zones. This feature enhances situational awareness and safety monitoring capabilities.

## Features

### 🏗️ Mine Structure Visualization
- **Realistic 3D Tunnels**: Multi-level tunnel system with proper depth representation
- **Support Beams**: Visual representation of tunnel support structures
- **Tunnel Lighting**: Simulated lighting system throughout the mine
- **Main Entrance**: Clear marking of the mine entrance with signage

### 👷 Worker Tracking
- **Real-time Location**: Live tracking of all workers in the mine
- **Status Indicators**: Color-coded status for each worker
  - 🟢 Green: Active/Normal
  - 🟡 Yellow: Warning
  - 🔴 Red: Danger
  - ⚫ Gray: Offline
- **Vital Signs**: Heart rate and oxygen level monitoring
- **Worker Details**: Click on any worker to view detailed information
- **Helmet Lights**: Visual representation of worker helmet lights

### ⚠️ Danger Zone Detection
- **Hazard Visualization**: Spherical danger zones with severity-based colors
- **Multiple Hazard Types**:
  - ☁️ Gas hazards (Methane, CO, etc.)
  - ⚠️ Structural hazards
  - 🔥 Temperature hazards
- **Pulsing Animation**: Danger zones pulse to draw attention
- **Detailed Information**: Click on zones to view gas levels, temperatures, and descriptions

### 🎮 Interactive Controls
- **Orbit Controls**: 
  - Left Click + Drag: Rotate view
  - Right Click + Drag: Pan view
  - Scroll: Zoom in/out
- **View Modes**:
  - Overview: Full mine view
  - Workers: Focus on worker locations
  - Dangers: Focus on hazard zones
- **Fullscreen Mode**: Toggle fullscreen for immersive experience

### 📊 Information Panels
- **Left Sidebar**:
  - View mode selector
  - Complete list of workers with vital signs
  - List of all danger zones with severity
- **Right Sidebar** (appears on selection):
  - Detailed worker information
  - Detailed danger zone information
  - Real-time vital signs

## Technical Stack

### Libraries Used
- **Three.js**: Core 3D rendering engine (v0.149.0)
- **React Three Fiber**: React renderer for Three.js (v8.15.12 - compatible with React 18)
- **@react-three/drei**: Useful helpers for React Three Fiber (v9.92.7 - compatible with React 18)
- **React Icons**: Icon components

### Important Note
This implementation uses React 18 compatible versions of React Three Fiber. If you're using React 19, you'll need to upgrade to:
- `@react-three/fiber@^9.0.0`
- `@react-three/drei@^10.0.0`

### Components Structure
```
src/
├── pages/
│   └── mine/
│       ├── MineVisualization.jsx     # Main page component
│       └── README.md                 # This file
├── components/
│   └── mine3d/
│       ├── MineView3D.jsx           # 3D Canvas wrapper
│       ├── Worker3D.jsx             # Worker 3D model
│       ├── DangerZone3D.jsx         # Danger zone visualization
│       └── MineStructure3D.jsx      # Mine tunnel structure
└── utils/
    └── mineData.js                  # Data generation utilities
```

## Usage

### Accessing the Feature
1. Login to the application
2. Navigate to "3D Mine View" from the sidebar
3. The 3D visualization will load automatically

### Interacting with Workers
1. Click on any worker in the 3D view
2. Worker details will appear in the right sidebar
3. View real-time vital signs and location
4. Close the sidebar by clicking the X button

### Viewing Danger Zones
1. Click on any danger zone (colored spheres)
2. Danger zone details will appear in the right sidebar
3. View hazard type, severity, and specific measurements
4. Use this information to coordinate evacuation or safety measures

### Changing View Modes
1. Use the left sidebar to select different view modes
2. Overview: Best for general monitoring
3. Workers: Focus on worker positions
4. Dangers: Focus on hazard zones

### Toggle Controls
- Click the gear icon to show/hide the left sidebar
- Click the expand icon to enter fullscreen mode
- Click the compress icon to exit fullscreen

## Data Updates

The visualization updates in real-time:
- Worker vital signs update every 5 seconds
- Danger zone data is fetched continuously
- Tunnel structure is static but can be updated via API

## Future Enhancements

### Planned Features
- [ ] Heat maps for gas concentration
- [ ] Worker path history/trails
- [ ] Communication system integration
- [ ] Emergency evacuation routes
- [ ] VR/AR support for immersive experience
- [ ] Multi-mine support
- [ ] Time-lapse replay of events
- [ ] Automated camera following for critical situations
- [ ] Integration with IoT sensors for real-time data
- [ ] Audio alerts for danger zones

### Technical Improvements
- [ ] Performance optimization for large mines
- [ ] Progressive loading of tunnel sections
- [ ] WebGL performance monitoring
- [ ] Mobile device optimization
- [ ] Offline mode with cached data

## Performance Considerations

- The 3D visualization uses WebGL and requires a modern browser
- For best performance, use Chrome, Firefox, or Edge
- Minimum recommended GPU: Integrated graphics
- Recommended GPU: Dedicated graphics card
- Mobile devices may experience reduced performance

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Recommended |
| Edge | ✅ Full | Good performance |
| Safari | ⚠️ Partial | Some features may be limited |
| Mobile | ⚠️ Limited | Reduced performance |

## Troubleshooting

### Black Screen or No Rendering
- Check if WebGL is enabled in your browser
- Update your graphics drivers
- Try a different browser

### Poor Performance
- Close other applications
- Reduce window size
- Disable hardware acceleration in browser settings
- Use a computer with better GPU

### Workers/Zones Not Appearing
- Check network connection
- Verify API endpoints are accessible
- Check browser console for errors

## API Integration

The visualization can be integrated with real backend APIs:

```javascript
// Example: Fetching real-time worker data
const fetchWorkers = async () => {
  const response = await fetch('/api/workers/locations');
  const data = await response.json();
  setWorkers(data);
};

// Example: Fetching danger zones
const fetchDangerZones = async () => {
  const response = await fetch('/api/safety/danger-zones');
  const data = await response.json();
  setDangerZones(data);
};
```

## Contributing

To add new features or improve the visualization:
1. Update the data models in `utils/mineData.js`
2. Modify the 3D components in `components/mine3d/`
3. Add new controls or UI in `pages/mine/MineVisualization.jsx`
4. Test performance and cross-browser compatibility

## Contact

For questions or issues related to the 3D Mine Visualization:
- Create an issue in the project repository
- Contact the development team
- Refer to the main project documentation
