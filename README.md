# NetScope - Browser Network Intelligence Dashboard

NetScope is a powerful browser extension that provides comprehensive network activity visualization and privacy analysis. It helps users understand and monitor their web browsing's network footprint while offering detailed privacy insights.

## Features

### 1. Real-time Network Monitoring

- Track all network requests in real-time
- Visualize data transfer sizes and patterns
- Monitor unique domains and request categories
- Filter and search through network traffic

### 2. Privacy Analysis

- Privacy risk scoring for domains
- Tracker detection and categorization
- Cookie analysis and classification
- Fingerprinting detection
- Third-party data sharing insights
- Geographical data flow tracking

### 3. Performance Metrics

- Request timing analysis
- Resource size monitoring
- Domain-wise performance breakdown
- Loading time optimization insights

## User Interface Screens

### 1. Popup Dashboard

[Insert Screenshot Here]

Quick overview panel accessible from the browser toolbar:

- Total requests count
- Total data transfer size
- Number of unique domains
- Request categories breakdown
- Quick actions (Clear Data, Open DevTools)

### 2. Network Monitor (DevTools Panel)

[Insert Screenshot Here]

Detailed network activity visualization:

- Real-time request table
- Advanced filtering options
- Request details viewer
- Timeline visualization
- Resource size breakdown
- Protocol statistics

### 3. Privacy Dashboard

[Insert Screenshot Here]

Comprehensive privacy analysis interface:

- Domain-wise privacy scores
- Tracker visualization
- Cookie analysis
- Data sharing patterns
- Privacy recommendations
- Risk assessment breakdown

### 4. Settings Panel

[Insert Screenshot Here]

Customize extension behavior:

- Filtering rules
- Privacy sensitivity levels
- Notification preferences
- Data retention settings
- Export/Import configurations

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd netscope
```

2. Install dependencies:

```bash
npm install
```

3. Build the extension:

```bash
npm run build
```

4. Load the extension in Chrome:

- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` directory

## Development

### Tech Stack

- React + TypeScript
- Vite for building
- TailwindCSS for styling
- Chrome Extensions Manifest V3

### Project Structure

```
src/
├── background/      # Service worker & background scripts
├── popup/          # Popup UI components
├── devtools/       # DevTools panel implementation
├── content/        # Content scripts
├── components/     # Reusable UI components
├── lib/           # Utility functions
└── types/         # TypeScript type definitions
```

### Running Development Environment

```bash
npm run dev
```

## Privacy Considerations

NetScope is designed with privacy in mind:

- All analysis is performed locally
- No data is sent to external servers
- Open-source and transparent
- Configurable privacy sensitivity

## Contributing

Contributions are welcomed!

## Screenshots

### Popup Dashboard

[Insert Popup Screenshot]

### Network Monitor

[Insert Network Monitor Screenshot]

### Privacy Dashboard

[Insert Privacy Dashboard Screenshot]
