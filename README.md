# Solutions Builder AI

A modern web application for designing cloud architecture solutions using AI. This wizard-based interface helps users define their technical requirements and generates comprehensive cloud solution architectures.

![Angular](https://img.shields.io/badge/Angular-21.0.0-red)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-blue)
![Node](https://img.shields.io/badge/Node-18.x%20%7C%2020.x%20%7C%2022.x-green)

## 🚀 Features

- **3-Step Wizard Interface**
  - Step 1: Problem Input (Industry, Business Scenario, Context Files, Data Sources)
  - Step 2: Review Your Input (Comprehensive review with edit capabilities)
  - Step 3: Architecture Generation (AI-powered solution generation)

- **Cytoscape Architecture Canvas** ✨ **PRIMARY CANVAS** (`/cytoscape`)
  
  **Professional Graph-Based Diagram Builder powered by Cytoscape.js**
  
  - **🎯 Component Library**: 50+ cloud services
    - **Infrastructure**: AWS EC2, GCP Compute Engine, Azure VM, Kubernetes, Docker
    - **AI & ML**: SageMaker, Vertex AI, Azure ML, TensorFlow, PyTorch
    - **Storage**: S3, Cloud Storage, Azure Blob, MongoDB, PostgreSQL, Redis
    - **Networking**: API Gateway, Load Balancer, CloudFront, VPN, Route 53
    - **Serverless**: Lambda, Cloud Functions, Azure Functions, Vercel
    - **Data Processing**: Spark, Kafka, Airflow, Databricks, Kinesis
    - **Databases**: RDS, Cloud SQL, DynamoDB, Cosmos DB, Firestore
    - **Cisco Products**: Catalyst, Webex, Meraki, SecureX, DNA Center
  
  - **🔗 Advanced Connections**:
    - Draw mode with edgehandles extension
    - Click and drag from node to node to create connections
    - Automatic edge routing with bezier curves
    - Connection labels and customization
    - Color-coded connection types
    - Smart parent assignment for grouped nodes
  
  - **📦 Grouping System**:
    - Create compound nodes (groups with child nodes)
    - Drag nodes into groups
    - Move groups with all children together
    - Customize group name and color
    - Visual distinction with dashed borders
    - Perfect for tier-based architectures
  
  - **🎨 Visual Features**:
    - Font Awesome icons for all components
    - Brand colors (AWS Orange, Azure Blue, GCP Blue, etc.)
    - Hover tooltips showing component details
    - Selection highlighting
    - Smooth animations
    - Dark theme optimized design
  
  - **⚡ Layout Algorithms**:
    - **COSE Layout**: Compound Spring Embedder for compact diagrams
    - **Breadthfirst**: Hierarchical tree layout
    - **Grid**: Uniform grid positioning
    - **Circle**: Circular arrangement
    - Smart auto-arrange after import
    - Manual drag-and-drop positioning
  
  - **💾 Export & Import**:
    - **JSON Export**: Simple format for easy editing
    - **JSON Import**: Load saved architectures
    - **PNG Export**: Download as image (2x resolution)
    - Three sample architectures included:
      - `simple-3-tier.json` - Basic web app
      - `medium-serverless.json` - AWS serverless
      - `complex-multi-cloud.json` - Enterprise multi-cloud
  
  - **🔧 Advanced Tools**:
    - Enhanced zoom (0.1x to 5x range)
    - Pan and autopan on drag
    - Delete nodes and connections
    - Clear canvas
    - Fit to screen
    - Smart Arrange button for auto-layout
  
  - **📚 Documentation**:
    - Complete developer guide: `CYTOSCAPE_DEVELOPER_GUIDE.md`
    - Sample architectures in `/samples` folder
    - API reference and best practices
    - Troubleshooting section

- **Modern UI/UX**
  - Dark theme with gradient backgrounds
  - Responsive design
  - Smooth animations and transitions
  - Step indicators with completion status

- **Data Source Management**
  - Add/Edit/Remove data sources
  - Multiple data source types (Database, File Storage, API, Stream, etc.)
  - Format, volume, and frequency specifications

- **Context Management**
  - Upload and manage context files (Documents, PDFs, Audio, Video)
  - Visual file type indicators
  - File size display

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x, v20.x, or v22.x (LTS recommended)
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: For version control

You can verify your installations:

```bash
node --version
npm --version
git --version
```

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.0.0 | Frontend framework |
| TypeScript | 5.6.2 | Programming language |
| Bootstrap | 5.3.3 | CSS framework |
| Font Awesome | 6.x | Icon library |
| **Cytoscape.js** | **3.33.1** | **Graph visualization library** |
| cytoscape-edgehandles | 4.0.1 | Connection drawing extension |
| cytoscape-autopan-on-drag | 2.2.1 | Auto-pan extension |
| Angular SSR | 21.0.4 | Server-side rendering |
| RxJS | 7.8.1 | Reactive programming |

## 📦 Installation

### Method 1: Standard Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samba425/solutions-builder.git
   cd architecture-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

The application will automatically reload when you make changes to the source files.

### Method 2: Docker Installation

#### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/samba425/solutions-builder.git
   cd architecture-builder
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:4200/`

4. **Stop the application**
   ```bash
   docker-compose down
   ```

#### Using Docker CLI

1. **Build the Docker image**
   ```bash
   docker build -t architecture-builder .
   ```

2. **Run the container**
   ```bash
   docker run -p 4200:4200 architecture-builder
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:4200/`

## 🏗️ Build

### Development Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Production Build
```bash
ng build --configuration production
```

This creates an optimized production build with:
- Minification
- Tree shaking
- Ahead-of-Time (AOT) compilation
- Server-side rendering support

## 🧪 Running Tests

### Unit Tests
```bash
ng test
```

This executes unit tests via [Karma](https://karma-runner.github.io).

### End-to-End Tests
```bash
ng e2e
```

## 📂 Project Structure

```
architecture-builder/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/              # Main wizard container
│   │   │   ├── problem-input/     # Step 1: Problem input form
│   │   │   ├── review/            # Step 2: Review screen
│   │   │   └── architecture/      # Step 3: Architecture generation
│   │   ├── app.component.ts       # Root component
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Routing configuration
│   ├── styles.css                 # Global styles
│   ├── index.html                 # HTML entry point
│   └── main.ts                    # Application bootstrap
├── public/                        # Static assets
├── angular.json                   # Angular CLI configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose configuration
└── README.md                      # This file
```

## 🎨 Component Overview

### Home Component
- Main wizard container
- Manages step navigation
- Shared form data state
- Step indicators with progress tracking

### Problem Input Component
- Industry category selection
- Business scenario textarea
- Context file management (Document, PDF, Audio, Video)
- Data source management with modal
- Form validation

### Review Component
- Comprehensive input review
- Section-wise edit capabilities
- Industry, Business, Context, and Data Sources display
- Navigation to previous step or architecture generation

### Architecture Component
- Final review before generation
- Edit functionality for each section
- Smart navigation (different sections → different steps)
- Architecture generation trigger

## 🐳 Docker Configuration

### Dockerfile Features
- Multi-stage build for optimal image size
- Node.js 20 Alpine base image
- Production-optimized build
- Port 4200 exposed
- Health check included

### Docker Compose Features
- Single command deployment
- Volume mounting for development
- Automatic restart policy
- Port mapping configuration

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 4200 |
| `npm run build` | Build the project for development |
| `ng build --configuration production` | Build the project for production |
| `ng test` | Run unit tests |
| `ng serve` | Serve the application |

## 🎯 Usage Guide

### Step 1: Problem Input
1. Select your industry category from the dropdown
2. Describe your business scenario in the textarea
3. (Optional) Add context by clicking context buttons (Document, PDF, Audio, Video)
4. Add data sources by clicking "Add Data Source"
5. Fill in data source details (Name*, Type*, Format, Volume, Frequency, Description)
6. Click "Continue to Preview"

### Step 2: Review Your Input
1. Review all entered information
2. Click "Edit" on any section to make changes
   - Industry/Business/Context edits → Go back to Step 1
   - Data Sources edit → Opens modal for inline editing
3. Click "Continue to Preview" to proceed

### Step 3: Architecture
1. Final review of all inputs
2. Edit any section if needed
3. Click "Open Canvas" to design visually with Cytoscape canvas
4. Click "Generate Architecture" to create your solution

### Cytoscape Canvas (Visual Designer)

**Recommended Route**: Step 3 → "Open Canvas" → Interactive Cytoscape Builder

#### Getting Started
1. Navigate to `/cytoscape` or click "Open Canvas" from Step 3
2. Browse the **component library** in the left sidebar
3. Drag components onto the canvas
4. Create connections between nodes
5. Organize with groups
6. Export your design

#### Component Library (50+ Services)
**Categories**:
- 🏗️ **Infrastructure** - EC2, Compute Engine, VMs, Kubernetes, Docker
- 🤖 **AI & ML** - SageMaker, Vertex AI, TensorFlow, PyTorch
- 💾 **Storage** - S3, Cloud Storage, MongoDB, PostgreSQL, Redis
- 🌐 **Networking** - API Gateway, Load Balancer, CDN, VPN
- ⚡ **Serverless** - Lambda, Cloud Functions, Azure Functions
- 📊 **Data Processing** - Spark, Kafka, Airflow, Databricks
- 🗄️ **Databases** - RDS, Cloud SQL, DynamoDB, Cosmos DB
- 🔧 **Cisco** - Catalyst, Webex, Meraki, SecureX

#### Creating Connections
1. Click **"Toggle Draw Mode"** button (🔗 icon) in toolbar
2. Click on source node - a handle appears
3. Drag handle to target node
4. Release to create connection
5. Double-click connection to customize label/style

#### Working with Groups
1. Click **"Create Group"** button (📦 icon)
2. A new group appears on canvas
3. Drag nodes into the group
4. Double-click group to customize name/color
5. Move group to move all children together

**Use Cases for Groups**:
- Tier-based architecture (Frontend, Backend, Data)
- Cloud provider separation (AWS, GCP, Azure)
- Environment isolation (Dev, Staging, Prod)
- Service domains (Auth, Analytics, Storage)

#### Layout & Positioning
**Manual Positioning**:
- Drag nodes to desired positions
- Groups can be moved with children

**Auto-Arrange**:
1. Click **"✨ Smart Arrange"** button
2. Algorithm: COSE (Compound Spring Embedder)
3. Creates compact layouts with short connections
4. Respects group hierarchies

**Zoom & Navigation**:
- Mouse wheel to zoom (0.1x to 5x)
- Click and drag background to pan
- Auto-pan activates near edges when dragging
- **Fit to Screen**: Click fit button

#### Node Details
Hover over any node to see:
- Component name
- Category (Infrastructure, AI/ML, etc.)
- Provider (AWS, GCP, Azure, Cisco)
- Description

Tooltip appears in top-right corner with scrollable content.

#### Saving & Loading
**Save Work**:
- Changes auto-save to browser localStorage
- Persists across sessions
- No server required

**Load Sample**:
1. Click **"Import JSON"**
2. Select from 3 sample architectures:
   - `simple-3-tier.json` - React + Node.js + PostgreSQL
   - `medium-serverless.json` - AWS serverless stack
   - `complex-multi-cloud.json` - Enterprise multi-cloud
3. Or upload your own JSON file

#### Exporting Designs

**JSON Export**:
1. Click **"Export JSON"** button
2. Downloads architecture in simple format:
```json
{
  "nodes": [
    {
      "id": "node-1",
      "name": "AWS EC2",
      "icon": "fab fa-aws",
      "color": "#FF9900",
      "x": 400,
      "y": 100,
      "componentProperties": {
        "category": "Infrastructure",
        "provider": "AWS"
      }
    }
  ],
  "connections": [
    {
      "from": "node-1",
      "to": "node-2",
      "label": "API Call"
    }
  ]
}
```

**PNG Export**:
1. Click **"🖼️ PNG"** button
2. Downloads 2x resolution image
3. Dark background included
4. Perfect for presentations

#### Keyboard Shortcuts
- `Delete` - Remove selected node/connection
- `Ctrl/Cmd + Z` - Undo (if implemented)
- `Escape` - Deselect all

#### Tips & Best Practices
✅ **DO**:
- Use groups for logical organization
- Label connections descriptively
- Keep related components close
- Use auto-arrange for quick layouts
- Save frequently (auto-saves to browser)

❌ **DON'T**:
- Create too many nested groups
- Overlap nodes unnecessarily
- Use generic labels like "Connection"
- Forget to export before clearing browser data

#### Advanced Features

**Connection Customization**:
- Double-click edge to edit
- Change label text
- Modify line color
- Adjust line width
- Choose line style (solid/dashed/dotted)

**Group Customization**:
- Double-click group to edit
- Change group name
- Modify color
- Adjust size by dragging nodes

**Sample Architectures**:
All samples use proper Font Awesome icons and are fully editable:

1. **Simple 3-Tier** (3 nodes):
   - React Frontend
   - Node.js API
   - PostgreSQL Database

2. **Medium Serverless** (8 nodes):
   - CloudFront CDN
   - Load Balancer
   - Dual React instances
   - API Gateway
   - Lambda functions
   - RDS Database
   - Redis Cache

3. **Complex Multi-Cloud** (22 nodes, 5 groups):
   - Frontend Tier (Cloudflare, React)
   - API Layer (AWS API Gateway, Node.js, Python)
   - Data Layer (RDS, MongoDB, Redis, S3, GCS, Elasticsearch)
   - Monitoring (Prometheus, Grafana, Datadog)
   - Container Orchestration (Kubernetes, Docker, Helm)

---

## 📚 Documentation

### Comprehensive Guides
- **`CYTOSCAPE_DEVELOPER_GUIDE.md`** - Complete developer documentation
  - Architecture overview
  - Technology stack explanation
  - Installation and setup
  - Core features walkthrough
  - API reference
  - Styling and theming
  - Event handling
  - Extension usage
  - Export/import formats
  - Layout algorithms
  - Sample architectures
  - Troubleshooting
  - Best practices
  - Advanced techniques

### Quick Links
- [Cytoscape.js Official Docs](https://js.cytoscape.org/)
- [Edgehandles Extension](https://github.com/cytoscape/cytoscape.js-edgehandles)
- [Autopan Extension](https://github.com/iVis-at-Bilkent/cytoscape.js-autopan-on-drag)
- [Font Awesome Icons](https://fontawesome.com/icons)

---

## 🐛 Troubleshooting

### Port Already in Use
If port 4200 is already in use:
```bash
# Find the process using port 4200
lsof -i :4200

# Kill the process
kill -9 <PID>

# Or use a different port
ng serve --port 4201
```

### Node Version Issues
```bash
# Check Node version
node --version

# Use nvm to switch versions
nvm install 20
nvm use 20
```

### Docker Issues
```bash
# Clean up Docker containers and images
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## 📝 Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful component/variable names
- Add comments for complex logic

### Component Structure
- Use standalone components
- Implement OnPush change detection where possible
- Keep components focused and small
- Use @Input/@Output for component communication

### Styling
- Use CSS variables for theming
- Follow BEM naming convention
- Keep styles scoped to components
- Use Bootstrap utilities when possible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sambasiva**
- GitHub: [@samba425](https://github.com/samba425)

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Bootstrap Team for the UI components
- All contributors and supporters

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Documentation](https://angular.dev/tools/cli).

---

**Built with ❤️ using Angular 21 and Bootstrap 5**

# Architecture-Builder
