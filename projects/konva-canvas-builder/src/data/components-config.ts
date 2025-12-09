// Component definitions matching the Build_ur_own_arch structure
export interface ComponentDefinition {
  id: string;
  name: string;
  icon: string;
  faIcon: string;
  category: string;
  provider: string;
  description: string;
  color: string;
}

export interface CategoryDefinition {
  name: string;
  icon: string;
  description: string;
  color: string;
  order: number;
}

export const COMPONENT_CATEGORIES: Record<string, CategoryDefinition> = {
  infrastructure: {
    name: "Infrastructure",
    icon: "fas fa-server",
    description: "Core computing and server infrastructure components",
    color: "#2196F3",
    order: 1
  },
  ai_models: {
    name: "AI Models",
    icon: "fas fa-brain",
    description: "Artificial Intelligence and Machine Learning models",
    color: "#9C27B0",
    order: 2
  },
  storage: {
    name: "Storage",
    icon: "fas fa-database",
    description: "Data storage and database solutions",
    color: "#FF9800",
    order: 3
  },
  networking: {
    name: "Networking",
    icon: "fas fa-network-wired",
    description: "Network connectivity and communication components",
    color: "#4CAF50",
    order: 4
  },
  data_processing: {
    name: "Data Processing",
    icon: "fas fa-chart-line",
    description: "Tools and platforms for processing, analyzing, and managing big data workflows",
    color: "#8B5CF6",
    order: 5
  },
  deployment: {
    name: "Deployment",
    icon: "fas fa-rocket",
    description: "Deployment platforms and services for hosting applications and services",
    color: "#10B981",
    order: 6
  },
  tooling: {
    name: "Tooling",
    icon: "fas fa-tools",
    description: "AI/ML development and deployment tools",
    color: "#28a745",
    order: 7
  },
  enterprise_ai: {
    name: "Enterprise AI",
    icon: "fas fa-network-wired",
    description: "Enterprise AI and machine learning solutions for enterprise networking and security",
    color: "#049FD9",
    order: 8
  },
  enterprise_ai_pods: {
    name: "Enterprise AI Pods",
    icon: "fas fa-folder",
    description: "Enterprise AI Pods for enterprise deployments",
    color: "#6c757d",
    order: 9
  }
};

export const COMPONENTS: Record<string, ComponentDefinition> = {
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    icon: "🟢",
    faIcon: "fas fa-brain",
    category: "ai_models",
    provider: "OpenAI",
    description: "GPT-4 is a large multimodal model that can accept image and text inputs and produce text outputs",
    color: "#10A37F"
  },
  "claude": {
    id: "claude",
    name: "Claude",
    icon: "🟣",
    faIcon: "fas fa-comments",
    category: "ai_models",
    provider: "Anthropic",
    description: "Claude is an AI assistant focused on helpfulness, honesty, and harmlessness",
    color: "#7C3AED"
  },
  "gemini": {
    id: "gemini",
    name: "Gemini",
    icon: "🔵",
    faIcon: "fas fa-gem",
    category: "ai_models",
    provider: "Google",
    description: "Google's most capable multimodal AI model",
    color: "#4285F4"
  },
  "llama": {
    id: "llama",
    name: "LLaMA",
    icon: "🔴",
    faIcon: "fab fa-meta",
    category: "ai_models",
    provider: "Meta",
    description: "Large Language Model Meta AI for research and commercial use",
    color: "#0668E1"
  },
  "nvidia-gpu": {
    id: "nvidia-gpu",
    name: "NVIDIA GPU",
    category: "infrastructure",
    provider: "NVIDIA",
    icon: "▣", // GPU chip representation - filled square
    faIcon: "fas fa-microchip",
    color: "#76B900",
    description: "High-performance GPU compute instances for AI/ML workloads"
  },
  "aws-ec2": {
    id: "aws-ec2",
    name: "AWS EC2",
    icon: "🖥️",
    faIcon: "fab fa-aws",
    category: "infrastructure",
    provider: "AWS",
    description: "Amazon Elastic Compute Cloud provides scalable computing capacity",
    color: "#FF9900"
  },
  "aws-lambda": {
    id: "aws-lambda",
    name: "AWS Lambda",
    icon: "🔶",
    faIcon: "fab fa-aws",
    category: "infrastructure",
    provider: "AWS",
    description: "Serverless compute service",
    color: "#FF9900"
  },
  "azure-vms": {
    id: "azure-vms",
    name: "Azure VMs",
    icon: "💻",
    faIcon: "fab fa-microsoft",
    category: "infrastructure",
    provider: "Azure",
    description: "Azure Virtual Machines - scalable computing in Microsoft Azure",
    color: "#0078D4"
  },
  "gcp-compute": {
    id: "gcp-compute",
    name: "GCP Compute Engine",
    icon: "☁️",
    faIcon: "fab fa-google",
    category: "infrastructure",
    provider: "GCP",
    description: "Google Compute Engine offers virtual machines in Google Cloud",
    color: "#4285F4"
  },
  "kubernetes": {
    id: "kubernetes",
    name: "Kubernetes",
    icon: "☸️",
    faIcon: "fas fa-dharmachakra",
    category: "infrastructure",
    provider: "CNCF",
    description: "Container orchestration platform",
    color: "#326CE5"
  },
  "docker": {
    id: "docker",
    name: "Docker",
    icon: "🐳",
    faIcon: "fas fa-cube",
    category: "infrastructure",
    provider: "Docker",
    description: "Container platform for building and running applications",
    color: "#2496ED"
  },
  "amazon-s3": {
    id: "amazon-s3",
    name: "Amazon S3",
    icon: "🪣",
    faIcon: "fab fa-aws",
    category: "storage",
    provider: "AWS",
    description: "Simple Storage Service - scalable object storage",
    color: "#569A31"
  },
  "dynamodb": {
    id: "dynamodb",
    name: "DynamoDB",
    icon: "🗃️",
    faIcon: "fab fa-aws",
    category: "storage",
    provider: "AWS",
    description: "Fast and flexible NoSQL database service",
    color: "#4053D6"
  },
  "rds": {
    id: "rds",
    name: "AWS RDS",
    icon: "🗄️",
    faIcon: "fab fa-aws",
    category: "storage",
    provider: "AWS",
    description: "Managed relational database service",
    color: "#527FFF"
  },
  "redis": {
    id: "redis",
    name: "Redis",
    icon: "🔴",
    faIcon: "fas fa-database",
    category: "storage",
    provider: "Redis Labs",
    description: "In-memory data structure store",
    color: "#DC382D"
  },
  "azure-blob": {
    id: "azure-blob",
    name: "Azure Blob Storage",
    icon: "📦",
    faIcon: "fab fa-microsoft",
    category: "storage",
    provider: "Azure",
    description: "Massively scalable object storage for unstructured data",
    color: "#0078D4"
  },
  "gcp-storage": {
    id: "gcp-storage",
    name: "GCP Cloud Storage",
    icon: "💾",
    faIcon: "fab fa-google",
    category: "storage",
    provider: "GCP",
    description: "Unified object storage for developers and enterprises",
    color: "#4285F4"
  },
  "weaviate": {
    id: "weaviate",
    name: "Weaviate",
    icon: "🟩",
    faIcon: "fas fa-vector-square",
    category: "storage",
    provider: "Weaviate",
    description: "Open-source vector database",
    color: "#22C55E"
  },
  "pinecone": {
    id: "pinecone",
    name: "Pinecone",
    icon: "🌲",
    faIcon: "fas fa-tree",
    category: "storage",
    provider: "Pinecone",
    description: "Vector database for machine learning",
    color: "#0EA5E9"
  },
  "chromadb": {
    id: "chromadb",
    name: "ChromaDB",
    icon: "🎨",
    faIcon: "fas fa-palette",
    category: "storage",
    provider: "Chroma",
    description: "The AI-native open-source embedding database",
    color: "#EC4899"
  },
  "api-gateway": {
    id: "api-gateway",
    name: "API Gateway",
    icon: "🚪",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Create, publish, and manage APIs",
    color: "#FF4F8B"
  },
  "load-balancer": {
    id: "load-balancer",
    name: "Load Balancer",
    icon: "⚖️",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Distribute incoming traffic across multiple targets",
    color: "#8C4FFF"
  },
  "cloudfront": {
    id: "cloudfront",
    name: "CloudFront",
    icon: "☁️",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Fast content delivery network (CDN)",
    color: "#8C4FFF"
  },
  "vpc": {
    id: "vpc",
    name: "VPC",
    icon: "🔒",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Virtual private cloud network",
    color: "#FF9900"
  },
  "apache-kafka": {
    id: "apache-kafka",
    name: "Apache Kafka",
    icon: "📨",
    faIcon: "fas fa-stream",
    category: "data_processing",
    provider: "Apache",
    description: "Distributed event streaming platform",
    color: "#231F20"
  },
  "apache-spark": {
    id: "apache-spark",
    name: "Apache Spark",
    icon: "⚡",
    faIcon: "fas fa-bolt",
    category: "data_processing",
    provider: "Apache",
    description: "Unified analytics engine for large-scale data processing",
    color: "#E25A1C"
  },
  "airflow": {
    id: "airflow",
    name: "Apache Airflow",
    icon: "🌬️",
    faIcon: "fas fa-wind",
    category: "data_processing",
    provider: "Apache",
    description: "Platform to programmatically author, schedule and monitor workflows",
    color: "#017CEE"
  },
  "cloudwatch": {
    id: "cloudwatch",
    name: "CloudWatch",
    icon: "📈",
    faIcon: "fab fa-aws",
    category: "deployment",
    provider: "AWS",
    description: "Monitoring and observability service",
    color: "#FF4F8B"
  },
  "grafana": {
    id: "grafana",
    name: "Grafana",
    icon: "📉",
    faIcon: "fas fa-chart-area",
    category: "deployment",
    provider: "Grafana Labs",
    description: "Analytics and monitoring platform",
    color: "#F46800"
  },
  "prometheus": {
    id: "prometheus",
    name: "Prometheus",
    icon: "🔥",
    faIcon: "fas fa-fire",
    category: "deployment",
    provider: "CNCF",
    description: "Open-source monitoring and alerting toolkit",
    color: "#E6522C"
  },
  "datadog": {
    id: "datadog",
    name: "Datadog",
    icon: "🐕",
    faIcon: "fas fa-dog",
    category: "deployment",
    provider: "Datadog",
    description: "Cloud monitoring and security platform",
    color: "#632CA6"
  },
  "terraform": {
    id: "terraform",
    name: "Terraform",
    icon: "🏗️",
    faIcon: "fas fa-code",
    category: "tooling",
    provider: "HashiCorp",
    description: "Infrastructure as Code tool",
    color: "#7B42BC"
  },
  "ansible": {
    id: "ansible",
    name: "Ansible",
    icon: "🔧",
    faIcon: "fas fa-cogs",
    category: "tooling",
    provider: "Red Hat",
    description: "IT automation platform",
    color: "#EE0000"
  },
  "jenkins": {
    id: "jenkins",
    name: "Jenkins",
    icon: "👷",
    faIcon: "fas fa-hard-hat",
    category: "tooling",
    provider: "Jenkins",
    description: "Open-source automation server",
    color: "#D24939"
  }
};
