# Smart_Parking_Allocation

An intelligent parking space allocation system built with Flask, featuring real-time space management, analytics, and optimization recommendations.

## Features

- **Real-time Parking Grid**: Visual representation of parking spaces with color-coded status
- **Space Management**: Reserve, release, and update occupancy of parking spaces
- **Intelligent Search**: Find nearest available spaces using graph algorithms
- **Analytics Dashboard**: Track occupancy rates, space utilization, and trends
- **Optimization Engine**: Get recommendations for improving space allocation
- **Responsive Design**: Works on desktop and mobile devices

  
parking-management-system/
├── app.py                 # Flask application and API routes
├── parking_manager.py     # Core parking management logic
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # CSS styles
    └── script.js         # JavaScript functionality


## API Endpoints

- `GET /api/parking-lot` - Get current parking lot state
- `POST /api/reserve-space` - Reserve a parking space
- `POST /api/release-reservation` - Release a space reservation
- `POST /api/toggle-occupancy` - Update space occupancy
- `POST /api/find-nearest` - Find nearest available space
- `GET /api/analytics` - Get parking analytics
- `GET /api/recommendations` - Get optimization recommendations

## Usage

1. **View Parking Lot**: See real-time status of all parking spaces
2. **Select Space**: Click on any space to view details and manage it
3. **Reserve Space**: Enter your name and reserve an available space
4. **Find Nearest**: Enter starting position and space preferences to find optimal parking
5. **Analytics**: View occupancy statistics and utilization metrics
6. **Optimization**: Get AI-powered recommendations for improving efficiency

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Algorithms**: Breadth-First Search (BFS) for pathfinding
- **Data Structures**: Hash maps for O(1) space lookup, adjacency lists for graph representation
