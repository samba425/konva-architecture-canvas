// Component definitions matching the Build_ur_own_arch structure
export interface ComponentProperty {
  type: 'number' | 'select' | 'text' | 'boolean';
  label: string;
  default?: any;
  min?: number;
  max?: number;
  options?: string[];
}

export interface ComponentDefinition {
  id: string;
  name: string;
  icon: string;
  faIcon: string;
  category: string;
  provider: string;
  description: string;
  definition: string;
  learnMoreLink?: string;
  color: string;
  properties?: Record<string, ComponentProperty>;
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
    definition: "GPT-4 is OpenAI's most advanced system, producing safer and more useful responses.",
    learnMoreLink: "https://openai.com/gpt-4",
    color: "#10A37F",
    properties: {
      maxTokens: {
        type: "number",
        label: "Max Tokens",
        default: 4096,
        min: 1,
        max: 8192
      },
      temperature: {
        type: "number",
        label: "Temperature",
        default: 0.7,
        min: 0,
        max: 2
      },
      apiVersion: {
        type: "select",
        label: "API Version",
        default: "2024-02-15-preview",
        options: ["2024-02-15-preview", "2023-12-01-preview", "2023-05-15"]
      }
    }
  },
  "claude": {
    id: "claude",
    name: "Claude",
    icon: "🟣",
    faIcon: "fas fa-comments",
    category: "ai_models",
    provider: "Anthropic",
    description: "Claude is an AI assistant focused on helpfulness, honesty, and harmlessness",
    definition: "Claude is Anthropic's AI assistant designed for safe and helpful conversations.",
    learnMoreLink: "https://www.anthropic.com/claude",
    color: "#7C3AED",
    properties: {
      maxTokens: {
        type: "number",
        label: "Max Tokens",
        default: 100000,
        min: 1,
        max: 200000
      },
      temperature: {
        type: "number",
        label: "Temperature",
        default: 1.0,
        min: 0,
        max: 1
      },
      modelVersion: {
        type: "select",
        label: "Model Version",
        default: "claude-3-opus",
        options: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]
      }
    }
  },
  "gemini": {
    id: "gemini",
    name: "Gemini",
    icon: "🔵",
    faIcon: "fas fa-gem",
    category: "ai_models",
    provider: "Google",
    description: "Google's most capable multimodal AI model",
    definition: "Gemini is Google's multimodal AI model built from the ground up for versatility.",
    learnMoreLink: "https://deepmind.google/technologies/gemini/",
    color: "#4285F4",
    properties: {
      modelVersion: {
        type: "select",
        label: "Model Version",
        default: "gemini-pro",
        options: ["gemini-pro", "gemini-pro-vision", "gemini-ultra"]
      },
      temperature: {
        type: "number",
        label: "Temperature",
        default: 0.7,
        min: 0,
        max: 2
      }
    }
  },
  "llama": {
    id: "llama",
    name: "LLaMA",
    icon: "🔴",
    faIcon: "fab fa-meta",
    category: "ai_models",
    provider: "Meta",
    description: "Large Language Model Meta AI for research and commercial use",
    definition: "LLaMA is Meta's foundational large language model designed for various NLP tasks.",
    learnMoreLink: "https://ai.meta.com/llama/",
    color: "#0668E1",
    properties: {
      modelSize: {
        type: "select",
        label: "Model Size",
        default: "7B",
        options: ["7B", "13B", "70B"]
      },
      temperature: {
        type: "number",
        label: "Temperature",
        default: 0.7,
        min: 0,
        max: 2
      }
    }
  },
  "nvidia-gpu": {
    id: "nvidia-gpu",
    name: "NVIDIA GPU",
    category: "infrastructure",
    provider: "NVIDIA",
    icon: "▣", // GPU chip representation - filled square
    faIcon: "fas fa-microchip",
    color: "#76B900",
    description: "High-performance GPU compute instances for AI/ML workloads",
    definition: "NVIDIA GPUs provide parallel processing power for machine learning and HPC workloads.",
    learnMoreLink: "https://www.nvidia.com/en-us/data-center/",
    properties: {
      gpu_type: {
        type: "select",
        label: "GPU Type",
        options: ["V100", "A100", "T4", "K80", "H100"],
        default: "T4"
      },
      gpu_count: {
        type: "number",
        label: "GPU Count",
        default: 1,
        min: 1,
        max: 8
      },
      memory: {
        type: "select",
        label: "GPU Memory",
        options: ["16GB", "32GB", "40GB", "80GB"],
        default: "16GB"
      }
    }
  },
  "aws-ec2": {
    id: "aws-ec2",
    name: "AWS EC2",
    icon: "🖥️",
    faIcon: "fab fa-aws",
    category: "infrastructure",
    provider: "AWS",
    description: "Amazon Elastic Compute Cloud provides scalable computing capacity",
    definition: "EC2 provides resizable compute capacity in the cloud.",
    learnMoreLink: "https://aws.amazon.com/ec2/",
    color: "#FF9900",
    properties: {
      instanceType: {
        type: "select",
        label: "Instance Type",
        options: ["t2.micro", "t2.small", "t2.medium", "t3.large", "c5.xlarge"],
        default: "t2.micro"
      },
      region: {
        type: "select",
        label: "Region",
        options: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"],
        default: "us-east-1"
      }
    }
  },
  "aws-lambda": {
    id: "aws-lambda",
    name: "AWS Lambda",
    icon: "🔶",
    faIcon: "fab fa-aws",
    category: "infrastructure",
    provider: "AWS",
    description: "Serverless compute service",
    definition: "AWS Lambda runs code without provisioning or managing servers.",
    learnMoreLink: "https://aws.amazon.com/lambda/",
    color: "#FF9900",
    properties: {
      memory: {
        type: "select",
        label: "Memory",
        options: ["128MB", "512MB", "1024MB", "3008MB"],
        default: "512MB"
      },
      timeout: {
        type: "number",
        label: "Timeout (seconds)",
        default: 30,
        min: 1,
        max: 900
      }
    }
  },
  "azure-vms": {
    id: "azure-vms",
    name: "Azure VMs",
    icon: "💻",
    faIcon: "fab fa-microsoft",
    category: "infrastructure",
    provider: "Azure",
    description: "Azure Virtual Machines - scalable computing in Microsoft Azure",
    definition: "Azure VMs provide on-demand scalable computing resources.",
    learnMoreLink: "https://azure.microsoft.com/en-us/services/virtual-machines/",
    color: "#0078D4",
    properties: {
      vmSize: {
        type: "select",
        label: "VM Size",
        options: ["Standard_B1s", "Standard_D2s_v3", "Standard_E4s_v3"],
        default: "Standard_B1s"
      },
      location: {
        type: "select",
        label: "Location",
        options: ["East US", "West Europe", "Southeast Asia"],
        default: "East US"
      }
    }
  },
  "gcp-compute": {
    id: "gcp-compute",
    name: "GCP Compute Engine",
    icon: "☁️",
    faIcon: "fab fa-google",
    category: "infrastructure",
    provider: "GCP",
    description: "Google Compute Engine offers virtual machines in Google Cloud",
    definition: "Compute Engine provides scalable VMs on Google Cloud infrastructure.",
    learnMoreLink: "https://cloud.google.com/compute",
    color: "#4285F4",
    properties: {
      machineType: {
        type: "select",
        label: "Machine Type",
        options: ["e2-micro", "n1-standard-1", "n2-standard-4"],
        default: "e2-micro"
      },
      zone: {
        type: "select",
        label: "Zone",
        options: ["us-central1-a", "europe-west1-b", "asia-east1-c"],
        default: "us-central1-a"
      }
    }
  },
  "kubernetes": {
    id: "kubernetes",
    name: "Kubernetes",
    icon: "☸️",
    faIcon: "fas fa-dharmachakra",
    category: "infrastructure",
    provider: "CNCF",
    description: "Container orchestration platform",
    definition: "Kubernetes is an open-source system for automating deployment and management of containerized applications.",
    learnMoreLink: "https://kubernetes.io/",
    color: "#326CE5",
    properties: {
      nodes: {
        type: "number",
        label: "Number of Nodes",
        default: 3,
        min: 1,
        max: 100
      },
      version: {
        type: "select",
        label: "Kubernetes Version",
        options: ["1.28", "1.27", "1.26"],
        default: "1.28"
      }
    }
  },
  "docker": {
    id: "docker",
    name: "Docker",
    icon: "🐳",
    faIcon: "fas fa-cube",
    category: "infrastructure",
    provider: "Docker",
    description: "Container platform for building and running applications",
    definition: "Docker is a platform for developing, shipping, and running applications in containers.",
    learnMoreLink: "https://www.docker.com/",
    color: "#2496ED",
    properties: {
      baseImage: {
        type: "select",
        label: "Base Image",
        options: ["ubuntu:latest", "alpine:latest", "python:3.9", "node:18"],
        default: "ubuntu:latest"
      }
    }
  },
  "amazon-s3": {
    id: "amazon-s3",
    name: "Amazon S3",
    icon: "🪣",
    faIcon: "fab fa-aws",
    category: "storage",
    provider: "AWS",
    description: "Simple Storage Service - scalable object storage",
    definition: "Amazon S3 is an object storage service offering scalability and durability.",
    learnMoreLink: "https://aws.amazon.com/s3/",
    color: "#569A31",
    properties: {
      storageClass: {
        type: "select",
        label: "Storage Class",
        options: ["Standard", "Intelligent-Tiering", "Glacier"],
        default: "Standard"
      },
      versioning: {
        type: "select",
        label: "Versioning",
        options: ["Enabled", "Disabled"],
        default: "Disabled"
      }
    }
  },
  "dynamodb": {
    id: "dynamodb",
    name: "DynamoDB",
    icon: "🗃️",
    faIcon: "fab fa-aws",
    category: "storage",
    provider: "AWS",
    description: "Fast and flexible NoSQL database service",
    definition: "DynamoDB is a fully managed NoSQL database service for any scale.",
    learnMoreLink: "https://aws.amazon.com/dynamodb/",
    color: "#4053D6",
    properties: {
      billingMode: {
        type: "select",
        label: "Billing Mode",
        options: ["On-Demand", "Provisioned"],
        default: "On-Demand"
      }
    }
  },
  "rds": {
    id: "rds",
    name: "AWS RDS",
    icon: "🗄️",
    faIcon: "fab fa-aws",
    category: "storage",
    provider: "AWS",
    description: "Managed relational database service",
    definition: "Amazon RDS makes it easy to set up, operate, and scale a relational database.",
    learnMoreLink: "https://aws.amazon.com/rds/",
    color: "#527FFF",
    properties: {
      engine: {
        type: "select",
        label: "Database Engine",
        options: ["MySQL", "PostgreSQL", "MariaDB", "Oracle", "SQL Server"],
        default: "PostgreSQL"
      },
      instanceClass: {
        type: "select",
        label: "Instance Class",
        options: ["db.t3.micro", "db.t3.small", "db.m5.large"],
        default: "db.t3.micro"
      }
    }
  },
  "redis": {
    id: "redis",
    name: "Redis",
    icon: "🔴",
    faIcon: "fas fa-database",
    category: "storage",
    provider: "Redis Labs",
    description: "In-memory data structure store",
    definition: "Redis is an open source, in-memory data store used as a database, cache, and message broker.",
    learnMoreLink: "https://redis.io/",
    color: "#DC382D",
    properties: {
      memorySize: {
        type: "select",
        label: "Memory Size",
        options: ["1GB", "2GB", "4GB", "8GB", "16GB"],
        default: "2GB"
      },
      persistence: {
        type: "select",
        label: "Persistence",
        options: ["Enabled", "Disabled"],
        default: "Enabled"
      }
    }
  },
  "azure-blob": {
    id: "azure-blob",
    name: "Azure Blob Storage",
    icon: "📦",
    faIcon: "fab fa-microsoft",
    category: "storage",
    provider: "Azure",
    description: "Massively scalable object storage for unstructured data",
    definition: "Azure Blob Storage is Microsoft's object storage solution for the cloud.",
    learnMoreLink: "https://azure.microsoft.com/en-us/services/storage/blobs/",
    color: "#0078D4",
    properties: {
      accessTier: {
        type: "select",
        label: "Access Tier",
        options: ["Hot", "Cool", "Archive"],
        default: "Hot"
      },
      redundancy: {
        type: "select",
        label: "Redundancy",
        options: ["LRS", "GRS", "ZRS"],
        default: "LRS"
      }
    }
  },
  "gcp-storage": {
    id: "gcp-storage",
    name: "GCP Cloud Storage",
    icon: "💾",
    faIcon: "fab fa-google",
    category: "storage",
    provider: "GCP",
    description: "Unified object storage for developers and enterprises",
    definition: "Cloud Storage is Google's unified object storage service.",
    learnMoreLink: "https://cloud.google.com/storage",
    color: "#4285F4",
    properties: {
      storageClass: {
        type: "select",
        label: "Storage Class",
        options: ["Standard", "Nearline", "Coldline", "Archive"],
        default: "Standard"
      }
    }
  },
  "weaviate": {
    id: "weaviate",
    name: "Weaviate",
    icon: "🟩",
    faIcon: "fas fa-vector-square",
    category: "storage",
    provider: "Weaviate",
    description: "Open-source vector database",
    definition: "Weaviate is an open-source vector database that stores data objects and vector embeddings.",
    learnMoreLink: "https://weaviate.io/",
    color: "#22C55E",
    properties: {
      vectorizer: {
        type: "select",
        label: "Vectorizer",
        options: ["text2vec-openai", "text2vec-huggingface", "text2vec-cohere"],
        default: "text2vec-openai"
      }
    }
  },
  "pinecone": {
    id: "pinecone",
    name: "Pinecone",
    icon: "🌲",
    faIcon: "fas fa-tree",
    category: "storage",
    provider: "Pinecone",
    description: "Vector database for machine learning",
    definition: "Pinecone is a fully managed vector database for building search and recommendation systems.",
    learnMoreLink: "https://www.pinecone.io/",
    color: "#0EA5E9",
    properties: {
      dimensions: {
        type: "number",
        label: "Vector Dimensions",
        default: 1536,
        min: 1,
        max: 20000
      },
      metric: {
        type: "select",
        label: "Distance Metric",
        options: ["cosine", "euclidean", "dotproduct"],
        default: "cosine"
      }
    }
  },
  "chromadb": {
    id: "chromadb",
    name: "ChromaDB",
    icon: "🎨",
    faIcon: "fas fa-palette",
    category: "storage",
    provider: "Chroma",
    description: "The AI-native open-source embedding database",
    definition: "Chroma is the open-source embedding database for building AI applications.",
    learnMoreLink: "https://www.trychroma.com/",
    color: "#EC4899",
    properties: {
      persistDirectory: {
        type: "text",
        label: "Persist Directory",
        default: "./chroma_db"
      }
    }
  },
  "api-gateway": {
    id: "api-gateway",
    name: "API Gateway",
    icon: "🚪",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Create, publish, and manage APIs",
    definition: "Amazon API Gateway is a fully managed service for creating and managing APIs.",
    learnMoreLink: "https://aws.amazon.com/api-gateway/",
    color: "#FF4F8B",
    properties: {
      apiType: {
        type: "select",
        label: "API Type",
        options: ["REST", "HTTP", "WebSocket"],
        default: "REST"
      },
      throttling: {
        type: "number",
        label: "Rate Limit (req/sec)",
        default: 1000,
        min: 1,
        max: 10000
      }
    }
  },
  "load-balancer": {
    id: "load-balancer",
    name: "Load Balancer",
    icon: "⚖️",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Distribute incoming traffic across multiple targets",
    definition: "Elastic Load Balancing automatically distributes traffic across multiple targets.",
    learnMoreLink: "https://aws.amazon.com/elasticloadbalancing/",
    color: "#8C4FFF",
    properties: {
      type: {
        type: "select",
        label: "Load Balancer Type",
        options: ["Application", "Network", "Gateway"],
        default: "Application"
      }
    }
  },
  "cloudfront": {
    id: "cloudfront",
    name: "CloudFront",
    icon: "☁️",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Fast content delivery network (CDN)",
    definition: "Amazon CloudFront is a fast content delivery network service.",
    learnMoreLink: "https://aws.amazon.com/cloudfront/",
    color: "#8C4FFF",
    properties: {
      priceClass: {
        type: "select",
        label: "Price Class",
        options: ["All", "US-Europe", "US-Europe-Asia"],
        default: "All"
      }
    }
  },
  "vpc": {
    id: "vpc",
    name: "VPC",
    icon: "🔒",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "AWS",
    description: "Virtual private cloud network",
    definition: "Amazon VPC lets you provision a logically isolated section of the AWS Cloud.",
    learnMoreLink: "https://aws.amazon.com/vpc/",
    color: "#FF9900",
    properties: {
      cidrBlock: {
        type: "text",
        label: "CIDR Block",
        default: "10.0.0.0/16"
      }
    }
  },
  "apache-kafka": {
    id: "apache-kafka",
    name: "Apache Kafka",
    icon: "📨",
    faIcon: "fas fa-stream",
    category: "data_processing",
    provider: "Apache",
    description: "Distributed event streaming platform",
    definition: "Apache Kafka is a distributed event store and stream-processing platform.",
    learnMoreLink: "https://kafka.apache.org/",
    color: "#231F20",
    properties: {
      partitions: {
        type: "number",
        label: "Partitions",
        default: 3,
        min: 1,
        max: 100
      },
      replicationFactor: {
        type: "number",
        label: "Replication Factor",
        default: 2,
        min: 1,
        max: 10
      }
    }
  },
  "apache-spark": {
    id: "apache-spark",
    name: "Apache Spark",
    icon: "⚡",
    faIcon: "fas fa-bolt",
    category: "data_processing",
    provider: "Apache",
    description: "Unified analytics engine for large-scale data processing",
    definition: "Apache Spark is a multi-language engine for executing data engineering and ML workloads.",
    learnMoreLink: "https://spark.apache.org/",
    color: "#E25A1C",
    properties: {
      executors: {
        type: "number",
        label: "Number of Executors",
        default: 2,
        min: 1,
        max: 100
      },
      memory: {
        type: "select",
        label: "Executor Memory",
        options: ["2GB", "4GB", "8GB", "16GB"],
        default: "4GB"
      }
    }
  },
  "airflow": {
    id: "airflow",
    name: "Apache Airflow",
    icon: "🌬️",
    faIcon: "fas fa-wind",
    category: "data_processing",
    provider: "Apache",
    description: "Platform to programmatically author, schedule and monitor workflows",
    definition: "Apache Airflow is an open-source workflow management platform.",
    learnMoreLink: "https://airflow.apache.org/",
    color: "#017CEE",
    properties: {
      workers: {
        type: "number",
        label: "Number of Workers",
        default: 2,
        min: 1,
        max: 10
      }
    }
  },
  "cloudwatch": {
    id: "cloudwatch",
    name: "CloudWatch",
    icon: "📈",
    faIcon: "fab fa-aws",
    category: "deployment",
    provider: "AWS",
    description: "Monitoring and observability service",
    definition: "Amazon CloudWatch collects and tracks metrics, logs, and events.",
    learnMoreLink: "https://aws.amazon.com/cloudwatch/",
    color: "#FF4F8B",
    properties: {
      retentionDays: {
        type: "select",
        label: "Log Retention",
        options: ["7", "14", "30", "90", "365"],
        default: "30"
      }
    }
  },
  "grafana": {
    id: "grafana",
    name: "Grafana",
    icon: "📉",
    faIcon: "fas fa-chart-area",
    category: "deployment",
    provider: "Grafana Labs",
    description: "Analytics and monitoring platform",
    definition: "Grafana is an open-source platform for monitoring and observability.",
    learnMoreLink: "https://grafana.com/",
    color: "#F46800",
    properties: {
      dashboards: {
        type: "number",
        label: "Number of Dashboards",
        default: 5,
        min: 1,
        max: 100
      }
    }
  },
  "prometheus": {
    id: "prometheus",
    name: "Prometheus",
    icon: "🔥",
    faIcon: "fas fa-fire",
    category: "deployment",
    provider: "CNCF",
    description: "Open-source monitoring and alerting toolkit",
    definition: "Prometheus is an open-source systems monitoring and alerting toolkit.",
    learnMoreLink: "https://prometheus.io/",
    color: "#E6522C",
    properties: {
      scrapeInterval: {
        type: "select",
        label: "Scrape Interval",
        options: ["15s", "30s", "60s"],
        default: "15s"
      }
    }
  },
  "datadog": {
    id: "datadog",
    name: "Datadog",
    icon: "🐕",
    faIcon: "fas fa-dog",
    category: "deployment",
    provider: "Datadog",
    description: "Cloud monitoring and security platform",
    definition: "Datadog provides full observability across your entire stack.",
    learnMoreLink: "https://www.datadoghq.com/",
    color: "#632CA6",
    properties: {
      apmEnabled: {
        type: "boolean",
        label: "APM Enabled",
        default: true
      }
    }
  },
  "terraform": {
    id: "terraform",
    name: "Terraform",
    icon: "🏗️",
    faIcon: "fas fa-code",
    category: "tooling",
    provider: "HashiCorp",
    description: "Infrastructure as Code tool",
    definition: "Terraform is an open-source infrastructure as code software tool.",
    learnMoreLink: "https://www.terraform.io/",
    color: "#7B42BC",
    properties: {
      provider: {
        type: "select",
        label: "Provider",
        options: ["AWS", "Azure", "GCP", "Multi-Cloud"],
        default: "AWS"
      }
    }
  },
  "ansible": {
    id: "ansible",
    name: "Ansible",
    icon: "🔧",
    faIcon: "fas fa-cogs",
    category: "tooling",
    provider: "Red Hat",
    description: "IT automation platform",
    definition: "Ansible is an open-source automation tool for configuration management and deployment.",
    learnMoreLink: "https://www.ansible.com/",
    color: "#EE0000",
    properties: {
      playbooks: {
        type: "number",
        label: "Number of Playbooks",
        default: 1,
        min: 1,
        max: 50
      }
    }
  },
  "jenkins": {
    id: "jenkins",
    name: "Jenkins",
    icon: "👷",
    faIcon: "fas fa-hard-hat",
    category: "tooling",
    provider: "Jenkins",
    description: "Open-source automation server",
    definition: "Jenkins is an open-source automation server for building, testing, and deploying software.",
    learnMoreLink: "https://www.jenkins.io/",
    color: "#D24939",
    properties: {
      agents: {
        type: "number",
        label: "Number of Agents",
        default: 2,
        min: 1,
        max: 10
      }
    }
  }
};
