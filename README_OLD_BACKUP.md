# Architecture Builder 🎨# Architecture Builder



> **Professional Canvas-Based Architecture Diagram Builder** - Create stunning cloud infrastructure, AI/ML systems, and technical architecture diagrams with an intuitive drag-and-drop interface powered by Konva.js.> A powerful, interactive canvas-based architecture diagram builder for creating cloud infrastructure, AI/ML systems, and technical architecture diagrams using Konva.js.



[![Angular](https://img.shields.io/badge/Angular-21.0-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)[![Angular](https://img.shields.io/badge/Angular-21.0-red.svg)](https://angular.io/)

[![Konva](https://img.shields.io/badge/Konva-10.0-0D83CD?style=for-the-badge&logo=konva)](https://konvajs.org/)[![Konva](https://img.shields.io/badge/Konva-10.0-blue.svg)](https://konvajs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)



---![Architecture Builder



## ✨ Key Features## 🚀 Features



### 🎯 Professional Canvas- **3-Step Wizard Interface**

- **Infinite Canvas** with smooth pan, zoom (mouse wheel), and grid system  - Step 1: Problem Input (Industry, Business Scenario, Context Files, Data Sources)

- **High Performance** rendering with Konva.js canvas engine  - Step 2: Review Your Input (Comprehensive review with edit capabilities)

- **Dark/Light Themes** for comfortable viewing in any environment  - Step 3: Architecture Generation (AI-powered solution generation)



### 🎨 Rich Component Library (47+ Pre-built Components)- **Cytoscape Architecture Canvas** ✨ **PRIMARY CANVAS** (`/cytoscape`)

- **Foundation Models**: Mistral, Llama, Gemma, GPT, Claude, Gemini, DeepSeek, Phi, Qwen, Grok, Nova, Coheres  

- **Data Storage**: Weaviate, Milvus, Pinecone, Chroma, pgVector, Neon  **Professional Graph-Based Diagram Builder powered by Cytoscape.js**

- **Agent Frameworks**: LangChain, Semantic Kernel, AutoGen, Camel AI, LlamaIndex, LangGraph, CrewAI, AWS Bedrock, Replit, OpenAI Operator  

- **Observability**: Langfuse, Comet Opik, Helicone, Arize Phoenix, Datadog, Amplitude, Sentry  - **🎯 Component Library**: 50+ cloud services

- **Tool Execution**: Composio, NPI, Exa, LinkUp, Browserbase      - **Infrastructure**: AWS EC2, GCP Compute Engine, Azure VM, Kubernetes, Docker

- **Memory Management**: Zep, Cognee, Mem0, VertexAI, NapthaAI, MaestroAI    - **AI & ML**: SageMaker, Vertex AI, Azure ML, TensorFlow, PyTorch

    - **Storage**: S3, Cloud Storage, Azure Blob, MongoDB, PostgreSQL, Redis

### 🔧 Advanced Grouping System    - **Networking**: API Gateway, Load Balancer, CloudFront, VPN, Route 53

- **Hierarchical Groups** with visual colored borders (purple, red, orange, green, blue)    - **Serverless**: Lambda, Cloud Functions, Azure Functions, Vercel

- **Nested Grouping** - Group of groups with automatic color coding by level    - **Data Processing**: Spark, Kafka, Airflow, Databricks, Kinesis

- **Drag to Move** entire groups as single units    - **Databases**: RDS, Cloud SQL, DynamoDB, Cosmos DB, Firestore

- **Extract Items** from groups to create new groups    - **Network Products**: Catalyst, Webex, Meraki, SecureX, DNA Center

- **Smart Border Colors** automatically assigned based on nesting depth  

  - **🔗 Advanced Connections**:

### 🎨 Powerful Drawing Tools    - Draw mode with edgehandles extension

- **Shapes**: Rectangle, Circle, Line, Arrow, Pen/Freehand    - Click and drag from node to node to create connections

- **Text Editor**: Rich text with editable labels (double-click to edit)    - Automatic edge routing with bezier curves

- **Smart Styling**:    - Connection labels and customization

  - **Stroke Mode**: Border/outline color control    - Color-coded connection types

  - **Fill Mode**: Interior/icon color control    - Smart parent assignment for grouped nodes

  - **Independent Opacity**: Separate sliders for stroke (100%) and fill (50%)  

  - **12-Color Palette** + Custom color picker  - **📦 Grouping System**:

  - **Stroke Width** adjustment    - Create compound nodes (groups with child nodes)

    - Drag nodes into groups

### ⚡ Smart Selection    - Move groups with all children together

- **Multi-Selection**: Shift+Click or drag-rectangle to select multiple items    - Customize group name and color

- **Select Inside Groups**: Click individual items in groups for color changes    - Visual distinction with dashed borders

- **Visual Feedback**: Blue glowing borders with white resize handles    - Perfect for tier-based architectures

  

### 💾 Import/Export  - **🎨 Visual Features**:

- **JSON Format**: Complete architecture preservation    - Font Awesome icons for all components

- **Nested Groups**: Full support for complex hierarchies    - Brand colors (AWS Orange, Azure Blue, GCP Blue, etc.)

- **Sample Architectures**: 3 ready-to-use examples included    - Hover tooltips showing component details

    - Selection highlighting

### ⌨️ Keyboard Shortcuts    - Smooth animations

- `Cmd/Ctrl + Z` - Undo    - Dark theme optimized design

- `Cmd/Ctrl + Shift + Z` - Redo  

- `Cmd/Ctrl + D` - Duplicate  - **⚡ Layout Algorithms**:

- `Cmd/Ctrl + G` - Group selected items    - **COSE Layout**: Compound Spring Embedder for compact diagrams

- `Cmd/Ctrl + Shift + G` - Ungroup    - **Breadthfirst**: Hierarchical tree layout

- `Cmd/Ctrl + A` - Select all    - **Grid**: Uniform grid positioning

- `Delete/Backspace` - Delete selected    - **Circle**: Circular arrangement

    - Smart auto-arrange after import

---    - Manual drag-and-drop positioning

  

## 🚀 Quick Start  - **💾 Export & Import**:

    - **JSON Export**: Simple format for easy editing

### Prerequisites    - **JSON Import**: Load saved architectures

```bash    - **PNG Export**: Download as image (2x resolution)

Node.js >= 18.x    - Three sample architectures included:

npm >= 10.x      - `simple-3-tier.json` - Basic web app

Git      - `medium-serverless.json` - AWS serverless

```      - `complex-multi-cloud.json` - Enterprise multi-cloud

  

### Installation  - **🔧 Advanced Tools**:

    - Enhanced zoom (0.1x to 5x range)

```bash    - Pan and autopan on drag

# Clone repository    - Delete nodes and connections

git clone https://github.com/demo/architecture-builder.git    - Clear canvas

cd architecture-builder    - Fit to screen

    - Smart Arrange button for auto-layout

# Install dependencies  

npm install  - **📚 Documentation**:

    - Complete developer guide: `CYTOSCAPE_DEVELOPER_GUIDE.md`

# Start development server    - Sample architectures in `/samples` folder

npm start    - API reference and best practices

```    - Troubleshooting section



Application opens at: **http://localhost:4200**- **Modern UI/UX**

  - Dark theme with gradient backgrounds

---  - Responsive design

  - Smooth animations and transitions

## 📖 Usage Guide  - Step indicators with completion status



### Basic Workflow- **Data Source Management**

  - Add/Edit/Remove data sources

#### 1️⃣ Add Components  - Multiple data source types (Database, File Storage, API, Stream, etc.)

- Browse **left sidebar** component library  - Format, volume, and frequency specifications

- **Search** for specific components

- **Drag & drop** onto canvas- **Context Management**

  - Upload and manage context files (Documents, PDFs, Audio, Video)

#### 2️⃣ Draw Shapes  - Visual file type indicators

- Select tool from **top toolbar**  - File size display

- **Click & drag** on canvas

- Release to complete## 📋 Prerequisites



#### 3️⃣ Create GroupsBefore you begin, ensure you have the following installed:

- **Select** multiple items (Shift+Click or drag-select)

- Press **Cmd+G** / **Ctrl+G**- **Node.js**: v18.x, v20.x, or v22.x (LTS recommended)

- Items grouped with colored border- **npm**: v9.x or higher (comes with Node.js)

- **Git**: For version control

#### 4️⃣ Style Items

- **Select** item(s)You can verify your installations:

- Use **right panel**:

  - Toggle **Stroke/Fill** mode```bash

  - Choose **color**node --version

  - Adjust **opacity**npm --version

  - Set **stroke width**git --version

```

#### 5️⃣ Edit Labels

- **Double-click** any shape## 🛠️ Technology Stack

- Type new text

- **Click outside** or press Enter| Technology | Version | Purpose |

|------------|---------|---------|

#### 6️⃣ Save Work| Angular | 21.0.0 | Frontend framework |

- Click **"Save Architecture"**| TypeScript | 5.6.2 | Programming language |

- JSON file downloads automatically| Bootstrap | 5.3.3 | CSS framework |

| Font Awesome | 6.x | Icon library |

---| **Cytoscape.js** | **3.33.1** | **Graph visualization library** |

| cytoscape-edgehandles | 4.0.1 | Connection drawing extension |

## 🎨 Advanced Features| cytoscape-autopan-on-drag | 2.2.1 | Auto-pan extension |

| Angular SSR | 21.0.4 | Server-side rendering |

### Nested Grouping| RxJS | 7.8.1 | Reactive programming |

Create complex hierarchies:

1. Create first-level groups (purple borders)## 📦 Installation

2. Select multiple groups

3. Press **Cmd+G** again### Method 1: Standard Installation

4. Parent group created with different color (red, orange, etc.)

1. **Clone the repository**

### Extract & Regroup   ```bash

Mix items from different groups:   git clone https://github.com/samba425/solutions-builder.git

1. Click items from **Group A**   cd architecture-builder

2. Shift+Click items from **Group B**     ```

3. Press **Cmd+G**

4. New group created, old groups auto-update2. **Install dependencies**

   ```bash

### Group Border Colors   npm install

- **Level 0**: 🟣 Purple   ```

- **Level 1**: 🔴 Red

- **Level 2**: 🟠 Orange3. **Start the development server**

- **Level 3**: 🟢 Green   ```bash

- **Level 4**: 🔵 Blue   npm start

- **Level 5+**: 🟣 Violet   ```



### Stroke vs Fill Colors4. **Open your browser**

   Navigate to `http://localhost:4200/`

**Stroke Color** (Border Mode):

- Changes **group border** colorThe application will automatically reload when you make changes to the source files.

- Modifies **text** color

- Adjusts **shape outlines**### Method 2: Docker Installation



**Fill Color** (Interior Mode):#### Using Docker Compose (Recommended)

- Changes **component icons**

- Modifies **shape fills**1. **Clone the repository**

- Regenerates SVG icons with new colors   ```bash

   git clone https://github.com/samba425/solutions-builder.git

---   cd architecture-builder

   ```

## 💾 Sample Architectures

2. **Start the application**

### Included Samples   ```bash

   docker-compose up

**1. AI Foundation Models Test** (`ai-foundation-models-test.json`)   ```

- 6 components (3 open-source, 3 closed-source)

- Demonstrates basic grouping3. **Access the application**

- Perfect for learning   Open your browser and navigate to `http://localhost:4200/`



**2. AI Components Showcase** (`ai-showcase-complete.json`)4. **Stop the application**

- 47 components across 6 categories   ```bash

- Complex nested grouping   docker-compose down

- Full-featured example   ```



**3. Simple 3-Tier** (`simple-3-tier.json`)#### Using Docker CLI

- Basic web application architecture

- Frontend, Backend, Database layers1. **Build the Docker image**

   ```bash

### Loading Samples   docker build -t architecture-builder .

1. Click **"Import Architecture"**   ```

2. Select file from `/samples` folder

3. Architecture loads instantly2. **Run the container**

   ```bash

---   docker run -p 4200:4200 architecture-builder

   ```

## 🛠️ Development

3. **Access the application**

### Project Structure   Open your browser and navigate to `http://localhost:4200/`



```## 🏗️ Build

architecture-builder/

├── src/### Development Build

│   ├── app/```bash

│   │   ├── components/npm run build

│   │   │   ├── konva-canvas-main/      # 🎯 Main canvas component```

│   │   │   │   ├── konva-canvas-main.component.ts

│   │   │   │   ├── konva-canvas-main.component.htmlThe build artifacts will be stored in the `dist/` directory.

│   │   │   │   └── konva-canvas-main.component.css

│   │   │   └── header/### Production Build

│   │   ├── data/```bash

│   │   │   ├── components-config.ts     # Component libraryng build --configuration production

│   │   │   └── components-data.ts```

│   │   ├── models/

│   │   │   └── interfaces.tsThis creates an optimized production build with:

│   │   └── services/- Minification

│   ├── styles.css- Tree shaking

│   └── main.ts- Ahead-of-Time (AOT) compilation

├── samples/                             # Sample architectures- Server-side rendering support

├── docs/                                # Documentation

├── package.json## 🧪 Running Tests

├── angular.json

└── tsconfig.json### Unit Tests

``````bash

ng test

### Key Technologies```



| Technology | Version | Purpose |This executes unit tests via [Karma](https://karma-runner.github.io).

|------------|---------|---------|

| Angular | 21.0.0 | Framework |### End-to-End Tests

| Konva.js | 10.0.12 | Canvas rendering |```bash

| TypeScript | 5.9.2 | Type safety |ng e2e

| RxJS | 7.8.0 | Reactive programming |```

| Angular Signals | 21.0 | State management |

## 📂 Project Structure

### Scripts

```

```basharchitecture-builder/

npm start              # Development server (port 4200)├── src/

npm run build          # Production build│   ├── app/

npm run watch          # Build with watch mode│   │   ├── components/

npm test               # Run tests│   │   │   ├── home/              # Main wizard container

npm run serve:ssr      # Serve with SSR│   │   │   ├── problem-input/     # Step 1: Problem input form

```│   │   │   ├── review/            # Step 2: Review screen

│   │   │   └── architecture/      # Step 3: Architecture generation

### Adding Components│   │   ├── app.component.ts       # Root component

│   │   ├── app.config.ts          # App configuration

**1. Define in `components-config.ts`:**│   │   └── app.routes.ts          # Routing configuration

│   ├── styles.css                 # Global styles

```typescript│   ├── index.html                 # HTML entry point

export const MY_COMPONENT: ComponentDefinition = {│   └── main.ts                    # Application bootstrap

  id: 'my-component',├── public/                        # Static assets

  name: 'My Component',├── angular.json                   # Angular CLI configuration

  icon: '🚀',├── package.json                   # Dependencies and scripts

  faIcon: 'fa-rocket',├── tsconfig.json                  # TypeScript configuration

  color: '#ff6b6b',├── Dockerfile                     # Docker configuration

  description: 'Component description',├── docker-compose.yml             # Docker Compose configuration

  provider: 'Provider Name',└── README.md                      # This file

  category: 'my-category'```

};

```## 🎨 Component Overview



**2. Add to array:**### Home Component

- Main wizard container

```typescript- Manages step navigation

export const COMPONENTS: ComponentItem[] = [- Shared form data state

  // ...existing- Step indicators with progress tracking

  MY_COMPONENT

];### Problem Input Component

```- Industry category selection

- Business scenario textarea

Component appears automatically in sidebar!- Context file management (Document, PDF, Audio, Video)

- Data source management with modal

---- Form validation



## 🏗️ Architecture### Review Component

- Comprehensive input review

### Component Architecture- Section-wise edit capabilities

- Industry, Business, Context, and Data Sources display

```- Navigation to previous step or architecture generation

AppComponent

└── KonvaCanvasMainComponent### Architecture Component

    ├── Left Sidebar (Component Library)- Final review before generation

    │   ├── Search- Edit functionality for each section

    │   ├── Categories- Smart navigation (different sections → different steps)

    │   └── Draggable Components- Architecture generation trigger

    ├── Canvas Area (Konva Stage)

    │   ├── Background Layer## 🐳 Docker Configuration

    │   ├── Grid Layer

    │   └── Main Layer (shapes, groups)### Dockerfile Features

    ├── Top Toolbar (Drawing Tools)- Multi-stage build for optimal image size

    └── Right Panel (Style Controls)- Node.js 20 Alpine base image

        ├── Color Mode Toggle- Production-optimized build

        ├── Color Picker- Port 4200 exposed

        ├── Opacity Sliders- Health check included

        └── Stroke Width

```### Docker Compose Features

- Single command deployment

### Data Flow- Volume mounting for development

- Automatic restart policy

```- Port mapping configuration

User Action → Angular Component → Konva.js API → Canvas Rendering

     ↓              ↓                    ↓              ↓## 🔧 Available Scripts

  Signals     State Update        Layer Update    Visual Update

```| Command | Description |

|---------|-------------|

### Key Design Patterns| `npm start` | Start development server on port 4200 |

| `npm run build` | Build the project for development |

- **Signals**: Reactive state (Angular 21)| `ng build --configuration production` | Build the project for production |

- **Command Pattern**: Undo/Redo system| `ng test` | Run unit tests |

- **Factory Pattern**: Component creation| `ng serve` | Serve the application |

- **Observer**: Event handling

## 🎯 Usage Guide

---

### Step 1: Problem Input

## 📦 Build & Deploy1. Select your industry category from the dropdown

2. Describe your business scenario in the textarea

### Production Build3. (Optional) Add context by clicking context buttons (Document, PDF, Audio, Video)

4. Add data sources by clicking "Add Data Source"

```bash5. Fill in data source details (Name*, Type*, Format, Volume, Frequency, Description)

npm run build6. Click "Continue to Preview"

# Output: dist/architecture-builder/browser/

```### Step 2: Review Your Input

1. Review all entered information

### Docker Deployment2. Click "Edit" on any section to make changes

   - Industry/Business/Context edits → Go back to Step 1

```bash   - Data Sources edit → Opens modal for inline editing

# Build image3. Click "Continue to Preview" to proceed

docker build -t architecture-builder .

### Step 3: Architecture

# Run container1. Final review of all inputs

docker run -p 8080:80 architecture-builder2. Edit any section if needed

```3. Click "Open Canvas" to design visually with Cytoscape canvas

4. Click "Generate Architecture" to create your solution

### Docker Compose

### Cytoscape Canvas (Visual Designer)

```bash

docker-compose up**Recommended Route**: Step 3 → "Open Canvas" → Interactive Cytoscape Builder

```

#### Getting Started

---1. Navigate to `/cytoscape` or click "Open Canvas" from Step 3

2. Browse the **component library** in the left sidebar

## 🐛 Troubleshooting3. Drag components onto the canvas

4. Create connections between nodes

### Canvas Not Rendering5. Organize with groups

- Check browser console for errors6. Export your design

- Verify Konva.js loaded successfully

- Clear browser cache#### Component Library (50+ Services)

**Categories**:

### Performance Issues- 🏗️ **Infrastructure** - EC2, Compute Engine, VMs, Kubernetes, Docker

- Reduce number of items on canvas- 🤖 **AI & ML** - SageMaker, Vertex AI, TensorFlow, PyTorch

- Use grouping to organize- 💾 **Storage** - S3, Cloud Storage, MongoDB, PostgreSQL, Redis

- Close other browser tabs- 🌐 **Networking** - API Gateway, Load Balancer, CDN, VPN

- ⚡ **Serverless** - Lambda, Cloud Functions, Azure Functions

### Export/Import Fails- 📊 **Data Processing** - Spark, Kafka, Airflow, Databricks

- Check file permissions- 🗄️ **Databases** - RDS, Cloud SQL, DynamoDB, Cosmos DB

- Verify JSON format- 🔧 **Network** - Catalyst, Webex, Meraki, SecureX

- Look for console errors

#### Creating Connections

---1. Click **"Toggle Draw Mode"** button (🔗 icon) in toolbar

2. Click on source node - a handle appears

## 📚 Documentation3. Drag handle to target node

4. Release to create connection

- **[Developer Guide](DEVELOPER_GUIDE.md)** - Complete development docs5. Double-click connection to customize label/style

- **[Code Cleanup Analysis](CODE_CLEANUP_ANALYSIS.md)** - Package cleanup report

- **[Konva Special Features](KONVA_SPECIAL_FEATURES.md)** - Advanced Konva usage#### Working with Groups

1. Click **"Create Group"** button (📦 icon)

---2. A new group appears on canvas

3. Drag nodes into the group

## 🤝 Contributing4. Double-click group to customize name/color

5. Move group to move all children together

1. Fork repository

2. Create feature branch (`git checkout -b feature/amazing-feature`)**Use Cases for Groups**:

3. Commit changes (`git commit -m 'Add amazing feature'`)- Tier-based architecture (Frontend, Backend, Data)

4. Push to branch (`git push origin feature/amazing-feature`)- Cloud provider separation (AWS, GCP, Azure)

5. Open Pull Request- Environment isolation (Dev, Staging, Prod)

- Service domains (Auth, Analytics, Storage)

### Code Standards

#### Layout & Positioning

- **TypeScript**: Strict mode enabled**Manual Positioning**:

- **Linting**: Angular style guide- Drag nodes to desired positions

- **Comments**: Document complex logic- Groups can be moved with children

- **Testing**: Unit tests for features

**Auto-Arrange**:

---1. Click **"✨ Smart Arrange"** button

2. Algorithm: COSE (Compound Spring Embedder)

## 📄 License3. Creates compact layouts with short connections

4. Respects group hierarchies

MIT License - see [LICENSE](LICENSE)

**Zoom & Navigation**:

---- Mouse wheel to zoom (0.1x to 5x)

- Click and drag background to pan

## 🙏 Acknowledgments- Auto-pan activates near edges when dragging

- **Fit to Screen**: Click fit button

- **Konva.js** - Canvas library

- **Angular Team** - Framework#### Node Details

- **Iconify** - Icon APIHover over any node to see:

- **Font Awesome** - Icons- Component name

- Category (Infrastructure, AI/ML, etc.)

---- Provider (AWS, GCP, Azure, Network)

- Description

## 📞 Support

Tooltip appears in top-right corner with scrollable content.

- **Issues**: [GitHub Issues](https://github.com/demo/architecture-builder/issues)

- **Email**: asambasi@demo.com#### Saving & Loading

**Save Work**:

---- Changes auto-save to browser localStorage

- Persists across sessions

## 🗺️ Roadmap- No server required



- [ ] Collaborative editing (WebSockets)**Load Sample**:

- [ ] Export to PNG/SVG1. Click **"Import JSON"**

- [ ] More component libraries (Kubernetes, Databases)2. Select from 3 sample architectures:

- [ ] Auto-layout algorithms   - `simple-3-tier.json` - React + Node.js + PostgreSQL

- [ ] Snap-to-grid enhancements   - `medium-serverless.json` - AWS serverless stack

- [ ] Version control integration   - `complex-multi-cloud.json` - Enterprise multi-cloud

- [ ] Cloud storage sync3. Or upload your own JSON file

- [ ] Template marketplace

#### Exporting Designs

---

**JSON Export**:

## 📊 Stats1. Click **"Export JSON"** button

2. Downloads architecture in simple format:

- **Components**: 47+```json

- **Categories**: 6{

- **Tools**: 7 drawing tools  "nodes": [

- **Colors**: 12 + custom picker    {

- **Keyboard Shortcuts**: 7      "id": "node-1",

- **Sample Files**: 3      "name": "AWS EC2",

      "icon": "fab fa-aws",

---      "color": "#FF9900",

      "x": 400,

**Built with ❤️ by the Team**      "y": 100,

      "componentProperties": {

*Empowering architects to design better systems*        "category": "Infrastructure",

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
