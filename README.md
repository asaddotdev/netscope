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

### 1. Popup

<img width="1375" height="850" alt="image" src="https://github.com/user-attachments/assets/cc648141-ec73-4ec8-835a-0574f3fa048e" />


Quick overview panel accessible from the browser toolbar:

- Total requests count
- Total data transfer size
- Number of unique domains
- Request categories breakdown
- Quick actions (Clear Data, Open DevTools)

### 2. Network Monitor (DevTools Panel)

<img width="1762" height="912" alt="image" src="https://github.com/user-attachments/assets/81cf0c16-79ee-447f-ac88-ef17d36e95c8" />


Detailed network activity visualization:

- Real-time request table
- Advanced filtering options
- Request details viewer
- Timeline visualization
- Resource size breakdown
- Protocol statistics

### 3. Privacy Dashboard

<img width="1762" height="944" alt="image" src="https://github.com/user-attachments/assets/9f06a666-a890-4639-ab65-d4b420cdc60a" />


Comprehensive privacy analysis interface:

- Domain-wise privacy scores
- Tracker visualization
- Cookie analysis
- Data sharing patterns
- Privacy recommendations
- Risk assessment breakdown

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

## Contributing

Contributions are welcomed!

## Screenshots

### Single Request

#### Headers

<img width="1763" height="942" alt="image" src="https://github.com/user-attachments/assets/7fec47a7-7003-4fe7-93bb-dcd8ec895b7e" />

#### Timing

<img width="1762" height="942" alt="image" src="https://github.com/user-attachments/assets/eb3959a6-f237-4987-aed8-9a6bfa3b0f34" />

#### Overview

<img width="1766" height="944" alt="image" src="https://github.com/user-attachments/assets/fa89ddc4-dfdc-4267-8044-2ad45274dcd3" />


### Replay Request

<img width="1767" height="947" alt="image" src="https://github.com/user-attachments/assets/9b59d47f-f388-4782-af32-fb9d87a189c1" />

<img width="1765" height="917" alt="image" src="https://github.com/user-attachments/assets/bb055048-3849-4ac2-9624-d76aed23f9be" />

### Privacy Score

<img width="1276" height="830" alt="image" src="https://github.com/user-attachments/assets/a7e68fe9-d438-4483-a069-d5676d169775" />

