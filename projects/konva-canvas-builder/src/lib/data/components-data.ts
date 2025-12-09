// Component definitions matching the Build_ur_own_arch structure
export const COMPONENT_CATEGORIES = {
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
    icon: "fas fa-database",
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
    description: "",
    color: "#6c757d",
    order: 999
  }
};

export const COMPONENTS = {
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    icon: "fas fa-brain",
    faIcon: "fas fa-brain",
    category: "ai_models",
    provider: "OpenAI",
    description: "GPT-4 is a large multimodal model that can accept image and text inputs and produce text outputs",
    definition: "GPT-4 is OpenAI's most advanced system, producing safer and more useful responses. It can solve difficult problems with greater accuracy thanks to its broader general knowledge and problem-solving abilities.",
    learnMoreLink: "https://openai.com/gpt-4",
    color: "#10A37F",
    canHaveChildren: false,
    image: "",
    template: "<div class=\"architecture-component ai-component\"><i class=\"fas fa-brain\"></i><span>GPT-4</span></div>",
    properties: {
      maxTokens: {
        type: "number" as const,
        label: "Max Tokens",
        default: 4096,
        min: 1,
        max: 8192
      },
      temperature: {
        type: "number" as const,
        label: "Temperature",
        default: 0.7,
        min: 0,
        max: 2,
        step: 0.1
      },
      apiVersion: {
        type: "select" as const,
        label: "API Version",
        default: "2024-02-15-preview",
        options: ["2024-02-15-preview", "2023-12-01-preview", "2023-05-15"]
      }
    }
  },
  "claude": {
    id: "claude",
    name: "Claude AI",
    icon: "fas fa-comments",
    faIcon: "fas fa-comments",
    category: "ai_models",
    provider: "Anthropic",
    description: "AI assistant focused on being helpful, harmless, and honest",
    definition: "Claude is an AI assistant created by Anthropic to be helpful, harmless, and honest through Constitutional AI training methods.",
    color: "#D97706",
    template: "<div class='component claude' data-type='claude'><i class='fas fa-comments'></i> Claude AI</div>",
    properties: {
      model_version: {
        type: "select" as const,
        label: "Model Version",
        default: "claude-3-sonnet",
        options: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]
      },
      max_tokens: {
        type: "number" as const,
        label: "Max Tokens",
        default: 4000
      },
      temperature: {
        type: "number" as const,
        label: "Temperature",
        default: 0.7
      }
    }
  },
  "llama": {
    id: "llama",
    name: "LLaMA",
    icon: "fab fa-meta",
    faIcon: "fab fa-meta",
    category: "ai_models",
    provider: "Meta",
    description: "Large Language Model Meta AI for research and commercial use",
    definition: "LLaMA (Large Language Model Meta AI) is a foundational large language model designed to help researchers advance their work in the subfield of AI.",
    learnMoreLink: "https://www.llama.com/",
    color: "#1877f2",
    canHaveChildren: false,
    image: "",
    template: "<div class='component llama' data-type='llama'><i class='fab fa-meta'></i> LLaMA</div>",
    properties: {
      model_size: {
        type: "select" as const,
        label: "Model Size",
        default: "7B",
        options: ["7B", "13B", "30B", "65B"],
        required: false
      },
      precision: {
        type: "select" as const,
        label: "Precision",
        default: "fp16",
        options: ["fp16", "fp32", "int8", "int4"],
        required: false
      },
      context_length: {
        type: "number" as const,
        label: "Context Length",
        default: 2048,
        required: false
      }
    }
  },
  "nvidia-gpu": {
    id: "nvidia-gpu",
    name: "NVIDIA GPU",
    category: "infrastructure",
    provider: "NVIDIA",
    icon: "fas fa-microchip",
    faIcon: "fas fa-microchip",
    color: "#76B900",
    description: "High-performance GPU compute instances for AI/ML workloads",
    definition: "NVIDIA GPUs provide parallel processing power for machine learning, deep learning, and high-performance computing workloads.",
    template: "<div class='component nvidia-gpu' data-type='nvidia-gpu'><i class='fas fa-microchip'></i> NVIDIA GPU</div>",
    properties: {
      gpu_type: {
        type: "select" as const,
        label: "GPU Type",
        options: ["V100", "A100", "T4", "K80", "H100"],
        default: "T4"
      },
      gpu_count: {
        type: "number" as const,
        label: "GPU Count",
        default: 1
      },
      memory: {
        type: "select" as const,
        label: "GPU Memory",
        options: ["16GB", "32GB", "40GB", "80GB"],
        default: "16GB"
      }
    }
  },
  "google-tpu": {
    id: "google-tpu",
    name: "Google TPU",
    icon: "fas fa-brain",
    faIcon: "fas fa-brain",
    category: "infrastructure",
    provider: "Google Cloud",
    description: "Tensor Processing Units designed for machine learning workloads",
    definition: "Google's Tensor Processing Units (TPUs) are custom-developed application-specific integrated circuits (ASICs) used to accelerate machine learning workloads.",
    color: "#EA4335",
    template: "<div class='component google-tpu' data-type='google-tpu'><i class='fas fa-brain'></i> Google TPU</div>",
    properties: {
      tpu_type: {
        type: "select" as const,
        label: "TPU Type",
        default: "v3",
        options: ["v2", "v3", "v4"]
      },
      topology: {
        type: "select" as const,
        label: "TPU Topology",
        default: "2x2",
        options: ["2x2", "4x4", "8x8"]
      }
    }
  },
  "aws-ec2": {
    id: "aws-ec2",
    name: "AWS EC2",
    icon: "fab fa-aws",
    faIcon: "fab fa-aws",
    category: "infrastructure",
    provider: "Amazon Web Services",
    description: "Amazon Elastic Compute Cloud provides scalable computing capacity in the AWS cloud",
    definition: "Amazon Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud. It allows you to quickly scale capacity, both up and down, as your computing requirements change.",
    learnMoreLink: "https://aws.amazon.com/ec2/",
    color: "#FF9900",
    canHaveChildren: false,
    image: "",
    template: "<div class=\"architecture-component aws-component\"><i class=\"fab fa-aws\"></i><span>AWS EC2</span></div>",
    properties: {
      instanceType: {
        type: "select" as const,
        label: "Instance Type",
        options: ["t3.micro", "t3.small", "t3.medium", "m5.large", "m5.xlarge"],
        default: "t3.micro"
      },
      region: {
        type: "select" as const,
        label: "AWS Region",
        options: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"],
        default: "us-east-1"
      },
      storage: {
        type: "number" as const,
        label: "Storage (GB)",
        default: 20,
        min: 8,
        max: 1000
      }
    }
  },
  "azure-vms": {
    id: "azure-vms",
    name: "Azure VMs",
    icon: "fab fa-microsoft",
    faIcon: "fab fa-microsoft",
    category: "infrastructure",
    provider: "Microsoft Azure",
    description: "Azure Virtual Machines are scalable computing resources in Microsoft Azure",
    definition: "Azure Virtual Machines (VMs) is one of several types of on-demand, scalable computing resources that Azure offers. An Azure VM gives you the flexibility of virtualization without having to buy and maintain the physical hardware.",
    learnMoreLink: "https://learn.microsoft.com/en-us/azure/virtual-machines/",
    color: "#0078D4",
    canHaveChildren: false,
    image: "",
    template: "<div class=\"architecture-component azure-component\"><i class=\"fab fa-microsoft\"></i><span>Azure VMs</span></div>",
    properties: {
      vmSize: {
        type: "select" as const,
        label: "VM Size",
        options: ["Standard_B1s", "Standard_B2s", "Standard_D2s_v3", "Standard_D4s_v3"],
        default: "Standard_B1s"
      },
      location: {
        type: "select" as const,
        label: "Azure Region",
        options: ["East US", "West US 2", "West Europe", "Southeast Asia"],
        default: "East US"
      },
      osType: {
        type: "select" as const,
        label: "Operating System",
        options: ["Linux", "Windows"],
        default: "Linux"
      }
    }
  },
  "gcp-compute": {
    id: "gcp-compute",
    name: "Google Compute Engine",
    icon: "fab fa-google",
    faIcon: "fab fa-google",
    category: "infrastructure",
    provider: "Google Cloud",
    description: "Scalable virtual machine instances on Google Cloud Platform",
    definition: "Google Compute Engine delivers virtual machines running in Google's innovative data centers and worldwide fiber network.",
    color: "#4285F4",
    template: "<div class='component gcp-compute' data-type='gcp-compute'><i class='fab fa-google'></i> Google Compute Engine</div>",
    properties: {
      machine_type: {
        type: "select" as const,
        label: "Machine Type",
        options: ["e2-micro", "e2-small", "e2-medium", "n2-standard-2", "n2-standard-4"],
        default: "e2-small"
      },
      zone: {
        type: "select" as const,
        label: "Zone",
        options: ["us-central1-a", "us-east1-b", "europe-west1-b"],
        default: "us-central1-a"
      },
      disk_size: {
        type: "number" as const,
        label: "Boot Disk Size (GB)",
        default: 20
      }
    }
  },
  "amazon-s3": {
    id: "amazon-s3",
    name: "Amazon S3",
    icon: "fas fa-database",
    faIcon: "fas fa-database",
    category: "storage",
    provider: "Amazon Web Services",
    description: "Amazon Simple Storage Service for scalable object storage",
    definition: "Amazon S3 is an object storage service that offers industry-leading scalability, data availability, security, and performance.",
    learnMoreLink: "https://aws.amazon.com/s3/",
    color: "#FF9900",
    canHaveChildren: false,
    image: "",
    template: "<div class=\"architecture-component storage-component\"><i class=\"fas fa-database\"></i><span>Amazon S3</span></div>",
    properties: {
      bucketName: {
        type: "text" as const,
        label: "Bucket Name",
        default: ""
      },
      storageClass: {
        type: "select" as const,
        label: "Storage Class",
        options: ["Standard", "Intelligent-Tiering", "Standard-IA", "Glacier"],
        default: "Standard"
      },
      encryption: {
        type: "checkbox" as const,
        label: "Enable Encryption",
        default: true
      }
    }
  },
  "azure-blob": {
    id: "azure-blob",
    name: "Azure Blob Storage",
    icon: "fab fa-microsoft",
    faIcon: "fab fa-microsoft",
    category: "storage",
    provider: "Microsoft Azure",
    description: "Scalable object storage for unstructured data",
    definition: "Azure Blob Storage is Microsoft's object storage solution for the cloud, optimized for storing massive amounts of unstructured data.",
    color: "#0078D4",
    template: "<div class='component azure-blob' data-type='azure-blob'><i class='fab fa-microsoft'></i> Azure Blob Storage</div>",
    properties: {
      tier: {
        type: "select" as const,
        label: "Access Tier",
        options: ["Hot", "Cool", "Archive"],
        default: "Hot"
      },
      replication: {
        type: "select" as const,
        label: "Replication Type",
        options: ["LRS", "ZRS", "GRS", "RA-GRS"],
        default: "LRS"
      },
      capacity: {
        type: "text" as const,
        label: "Storage Capacity",
        default: "1TB"
      }
    }
  },
  "gcp-storage": {
    id: "gcp-storage",
    name: "Google Cloud Storage",
    icon: "fab fa-google",
    faIcon: "fab fa-google",
    category: "storage",
    provider: "Google Cloud",
    description: "Unified object storage for developers and enterprises",
    definition: "Google Cloud Storage is a unified object storage for developers and enterprises, from live data serving to data analytics/ML to data archival.",
    color: "#4285F4",
    template: "<div class='component gcp-storage' data-type='gcp-storage'><i class='fab fa-google'></i> Google Cloud Storage</div>",
    properties: {
      storage_class: {
        type: "select" as const,
        label: "Storage Class",
        options: ["Standard", "Nearline", "Coldline", "Archive"],
        default: "Standard"
      },
      location: {
        type: "select" as const,
        label: "Location",
        options: ["us-central1", "us-east1", "europe-west1"],
        default: "us-central1"
      },
      versioning: {
        type: "boolean" as const,
        label: "Enable Versioning",
        default: false
      }
    }
  },
  "aws-efs": {
    id: "aws-efs",
    name: "Amazon EFS",
    icon: "fab fa-aws",
    faIcon: "fab fa-aws",
    category: "storage",
    provider: "Amazon Web Services",
    description: "Scalable file storage for Amazon EC2",
    definition: "Amazon Elastic File System (EFS) provides a simple, scalable, fully managed elastic NFS file system for use with AWS Cloud services and on-premises resources.",
    color: "#FF9900",
    template: "<div class='component aws-efs' data-type='aws-efs'><i class='fab fa-aws'></i> Amazon EFS</div>",
    properties: {
      performance_mode: {
        type: "select" as const,
        label: "Performance Mode",
        options: ["General Purpose", "Max I/O"],
        default: "General Purpose"
      },
      throughput_mode: {
        type: "select" as const,
        label: "Throughput Mode",
        options: ["Bursting", "Provisioned"],
        default: "Bursting"
      },
      storage_class: {
        type: "select" as const,
        label: "Storage Class",
        options: ["Standard", "Standard-IA"],
        default: "Standard"
      }
    }
  },
  "vpc": {
    id: "vpc",
    name: "VPC",
    icon: "fas fa-network-wired",
    faIcon: "fas fa-network-wired",
    category: "networking",
    provider: "AWS/Azure/GCP",
    description: "Virtual Private Cloud for isolated network environments",
    definition: "A Virtual Private Cloud (VPC) is a secure, isolated private cloud hosted within a public cloud. VPCs combine the scalability and convenience of public cloud computing with the data isolation of private cloud computing.",
    learnMoreLink: "https://aws.amazon.com/vpc/",
    color: "#4CAF50",
    canHaveChildren: true,
    image: "",
    template: "<div class=\"architecture-component network-component\"><i class=\"fas fa-network-wired\"></i><span>VPC</span></div>",
    properties: {
      cidrBlock: {
        type: "text" as const,
        label: "CIDR Block",
        default: "10.0.0.0/16"
      },
      enableDnsSupport: {
        type: "checkbox" as const,
        label: "Enable DNS Support",
        default: true
      },
      enableDnsHostnames: {
        type: "checkbox" as const,
        label: "Enable DNS Hostnames",
        default: true
      }
    }
  },
  "aws-alb": {
    id: "aws-alb",
    name: "AWS Application Load Balancer",
    icon: "fab fa-aws",
    faIcon: "fab fa-aws",
    category: "networking",
    provider: "Amazon Web Services",
    description: "Layer 7 load balancer for HTTP/HTTPS traffic",
    definition: "Application Load Balancer operates at the request level (layer 7), routing traffic to targets within Amazon VPC based on the content of the request.",
    color: "#FF9900",
    template: "<div class='component aws-alb' data-type='aws-alb'><i class='fab fa-aws'></i> AWS Application Load Balancer</div>",
    properties: {
      scheme: {
        type: "select" as const,
        label: "Scheme",
        options: ["internet-facing", "internal"],
        default: "internet-facing"
      },
      listener_port: {
        type: "number" as const,
        label: "Listener Port",
        default: 80
      },
      ip_address_type: {
        type: "select" as const,
        label: "IP Address Type",
        options: ["ipv4", "dualstack"],
        default: "ipv4"
      }
    }
  },
  "azure-vnet": {
    id: "azure-vnet",
    name: "Azure Virtual Network",
    icon: "fab fa-microsoft",
    faIcon: "fab fa-microsoft",
    category: "networking",
    provider: "Microsoft Azure",
    description: "Private network in Azure cloud",
    definition: "Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure, enabling secure communication between Azure resources.",
    color: "#0078D4",
    template: "<div class='component azure-vnet' data-type='azure-vnet'><i class='fab fa-microsoft'></i> Azure Virtual Network</div>",
    properties: {
      address_space: {
        type: "text" as const,
        label: "Address Space (CIDR)",
        default: "10.0.0.0/16"
      },
      subnet_count: {
        type: "number" as const,
        label: "Number of Subnets",
        default: 2
      },
      dns_servers: {
        type: "text" as const,
        label: "Custom DNS Servers",
        default: ""
      }
    }
  },
  "gcp-vpc": {
    id: "gcp-vpc",
    name: "Google VPC",
    icon: "fab fa-google",
    faIcon: "fab fa-google",
    category: "networking",
    provider: "Google Cloud",
    description: "Virtual Private Cloud network on Google Cloud",
    definition: "Google Cloud Virtual Private Cloud (VPC) provides networking functionality to Compute Engine virtual machine instances, Google Kubernetes Engine clusters, and other resources.",
    color: "#4285F4",
    template: "<div class='component gcp-vpc' data-type='gcp-vpc'><i class='fab fa-google'></i> Google VPC</div>",
    properties: {
      subnet_mode: {
        type: "select" as const,
        label: "Subnet Mode",
        options: ["Auto", "Custom"],
        default: "Auto"
      },
      routing_mode: {
        type: "select" as const,
        label: "Routing Mode",
        options: ["Regional", "Global"],
        default: "Regional"
      },
      firewall_rules: {
        type: "number" as const,
        label: "Number of Firewall Rules",
        default: 3
      }
    }
  },
  "apache-kafka": {
    id: "apache-kafka",
    name: "Apache Kafka",
    icon: "fas fa-stream",
    faIcon: "fas fa-stream",
    category: "data_processing",
    provider: "Apache",
    description: "Distributed streaming platform for real-time data feeds",
    definition: "Apache Kafka is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, and mission-critical applications.",
    color: "#231F20",
    template: "<div class='component apache-kafka' data-type='apache-kafka'><i class='fas fa-stream'></i> Apache Kafka</div>",
    properties: {
      partitions: {
        type: "number" as const,
        label: "Number of Partitions",
        default: 6
      },
      replication_factor: {
        type: "number" as const,
        label: "Replication Factor",
        default: 3
      },
      retention_hours: {
        type: "number" as const,
        label: "Retention Hours",
        default: 168
      }
    }
  },
  "apache-spark": {
    id: "apache-spark",
    name: "Apache Spark",
    icon: "fas fa-fire",
    faIcon: "fas fa-fire",
    category: "data_processing",
    provider: "Apache",
    description: "Unified analytics engine for large-scale data processing",
    definition: "Apache Spark is a unified analytics engine for large-scale data processing with built-in modules for streaming, SQL, machine learning and graph processing.",
    color: "#E25A1C",
    template: "<div class='component apache-spark' data-type='apache-spark'><i class='fas fa-fire'></i> Apache Spark</div>",
    properties: {
      cluster_mode: {
        type: "select" as const,
        label: "Cluster Mode",
        options: ["Standalone", "YARN", "Kubernetes", "Mesos"],
        default: "Standalone"
      },
      executor_memory: {
        type: "text" as const,
        label: "Executor Memory",
        default: "2g"
      },
      executor_cores: {
        type: "number" as const,
        label: "Executor Cores",
        default: 2
      }
    }
  },
  "aws-ecs": {
    id: "aws-ecs",
    name: "Amazon ECS",
    icon: "fab fa-aws",
    faIcon: "fab fa-aws",
    category: "deployment",
    provider: "Amazon Web Services",
    description: "Fully managed container orchestration service",
    definition: "Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications.",
    color: "#FF9900",
    template: "<div class='component aws-ecs' data-type='aws-ecs'><i class='fab fa-aws'></i> Amazon ECS</div>",
    properties: {
      launch_type: {
        type: "select" as const,
        label: "Launch Type",
        options: ["EC2", "Fargate"],
        default: "Fargate"
      },
      task_cpu: {
        type: "select" as const,
        label: "Task CPU",
        options: ["256", "512", "1024", "2048"],
        default: "512"
      },
      task_memory: {
        type: "select" as const,
        label: "Task Memory (MB)",
        options: ["512", "1024", "2048", "4096"],
        default: "1024"
      }
    }
  },
  "azure-aci": {
    id: "azure-aci",
    name: "Azure Container Instances",
    icon: "fab fa-microsoft",
    faIcon: "fab fa-microsoft",
    category: "deployment",
    provider: "Microsoft Azure",
    description: "Serverless containers on Azure without managing infrastructure",
    definition: "Azure Container Instances (ACI) offers the fastest and simplest way to run a container in Azure, without having to manage any virtual machines or adopt a higher-level service.",
    color: "#0078D4",
    template: "<div class='component azure-aci' data-type='azure-aci'><i class='fab fa-microsoft'></i> Azure Container Instances</div>",
    properties: {
      os_type: {
        type: "select" as const,
        label: "OS Type",
        options: ["Linux", "Windows"],
        default: "Linux"
      },
      cpu_cores: {
        type: "number" as const,
        label: "CPU Cores",
        default: 1
      },
      memory_gb: {
        type: "number" as const,
        label: "Memory (GB)",
        default: 1.5
      }
    }
  },
  "kubernetes": {
    id: "kubernetes",
    name: "Kubernetes",
    icon: "fas fa-dharmachakra",
    faIcon: "fas fa-dharmachakra",
    category: "tooling",
    provider: "CNCF",
    description: "Container orchestration platform for automating deployment and scaling",
    definition: "Kubernetes is an open-source container orchestration system for automating software deployment, scaling, and management.",
    learnMoreLink: "https://kubernetes.io/docs/concepts/overview/",
    color: "#326ce5",
    canHaveChildren: false,
    image: "",
    template: "<div class='component kubernetes' data-type='kubernetes'><i class='fas fa-dharmachakra'></i> Kubernetes</div>",
    properties: {
      node_count: {
        type: "number" as const,
        label: "Node Count",
        default: 3,
        required: true
      },
      pod_count: {
        type: "number" as const,
        label: "POD Count",
        default: 1,
        min: 1,
        max: 5,
        required: true
      },
      cluster_type: {
        type: "select" as const,
        label: "Cluster Type",
        options: ["EKS", "AKS", "GKE", "Self-managed"],
        default: "EKS",
        required: false
      }
    }
  },
  "docker": {
    id: "docker",
    name: "Docker",
    icon: "fab fa-docker",
    faIcon: "fab fa-docker",
    category: "tooling",
    provider: "Docker Inc.",
    description: "Platform for building, shipping and running applications using containers",
    definition: "Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.",
    color: "#2496ED",
    template: "<div class='component docker' data-type='docker'><i class='fab fa-docker'></i> Docker</div>",
    properties: {
      runtime: {
        type: "select" as const,
        label: "Runtime",
        options: ["containerd", "runc", "docker"],
        default: "docker"
      },
      registry: {
        type: "text" as const,
        label: "Registry URL",
        default: "docker.io"
      }
    }
  },
  "terraform": {
    id: "terraform",
    name: "Terraform",
    icon: "fas fa-layer-group",
    faIcon: "fas fa-layer-group",
    category: "tooling",
    provider: "HashiCorp",
    description: "Infrastructure as code provisioning tool",
    definition: "HashiCorp Terraform is an infrastructure as code tool that lets you build, change, and version infrastructure safely and efficiently.",
    color: "#623CE4",
    template: "<div class='component terraform' data-type='terraform'><i class='fas fa-layer-group'></i> Terraform</div>",
    properties: {
      provider: {
        type: "select" as const,
        label: "Cloud Provider",
        options: ["aws", "azure", "gcp", "multi-cloud"],
        default: "aws"
      },
      workspace: {
        type: "text" as const,
        label: "Workspace Name",
        default: "default"
      }
    }
  },
  "jenkins": {
    id: "jenkins",
    name: "Jenkins",
    icon: "fas fa-robot",
    faIcon: "fas fa-robot",
    category: "tooling",
    provider: "Jenkins Project",
    description: "Open source automation server for CI/CD pipelines",
    definition: "Jenkins is an open source automation server which enables developers to reliably build, test, and deploy their software.",
    color: "#D33833",
    template: "<div class='component jenkins' data-type='jenkins'><i class='fas fa-robot'></i> Jenkins</div>",
    properties: {
      pipeline_type: {
        type: "select" as const,
        label: "Pipeline Type",
        options: ["Declarative", "Scripted", "Blue Ocean"],
        default: "Declarative"
      },
      agents: {
        type: "number" as const,
        label: "Agent Count",
        default: 2
      }
    }
  },
  "mlflow": {
    id: "mlflow",
    name: "MLflow",
    icon: "fas fa-diagram-project",
    faIcon: "fas fa-diagram-project",
    category: "tooling",
    provider: "MLflow",
    description: "Machine learning lifecycle management platform",
    definition: "MLflow is an open-source platform for managing the complete machine learning lifecycle, including experimentation, reproducibility, and deployment.",
    color: "#0194E2",
    template: "<div class='component mlflow' data-type='mlflow'><i class='fas fa-diagram-project'></i> MLflow</div>",
    properties: {
      tracking_server: {
        type: "text" as const,
        label: "Tracking Server URL",
        default: "http://localhost:5000"
      },
      artifact_store: {
        type: "select" as const,
        label: "Artifact Store",
        options: ["S3", "Azure Blob", "GCS", "Local"],
        default: "Local"
      }
    }
  },
  "kubeflow": {
    id: "kubeflow",
    name: "Kubeflow",
    icon: "fas fa-gears",
    faIcon: "fas fa-gears",
    category: "tooling",
    provider: "Kubeflow",
    description: "Machine learning toolkit for Kubernetes",
    definition: "Kubeflow is an open-source platform for machine learning operations on Kubernetes, providing a simple, portable, and scalable way to deploy ML workflows.",
    color: "#326ce5",
    template: "<div class='component kubeflow' data-type='kubeflow'><i class='fas fa-gears'></i> Kubeflow</div>",
    properties: {
      version: {
        type: "select" as const,
        label: "Version",
        options: ["1.7", "1.6", "1.5"],
        default: "1.7"
      },
      namespace: {
        type: "text" as const,
        label: "Kubernetes Namespace",
        default: "kubeflow"
      }
    }
  },
  "airflow": {
    id: "airflow",
    name: "Apache Airflow",
    icon: "fas fa-wind",
    faIcon: "fas fa-wind",
    category: "tooling",
    provider: "Apache",
    description: "Platform for developing, scheduling and monitoring workflows",
    definition: "Apache Airflow is an open-source workflow management platform for data engineering pipelines and ML workflows.",
    color: "#017CEE",
    template: "<div class='component airflow' data-type='airflow'><i class='fas fa-wind'></i> Apache Airflow</div>",
    properties: {
      executor: {
        type: "select" as const,
        label: "Executor Type",
        options: ["LocalExecutor", "CeleryExecutor", "KubernetesExecutor"],
        default: "LocalExecutor"
      },
      scheduler_count: {
        type: "number" as const,
        label: "Scheduler Count",
        default: 1
      }
    }
  },
  "network-catalyst": {
    id: "network-catalyst",
    name: "Network Catalyst AI",
    icon: "fas fa-network-wired",
    faIcon: "fas fa-network-wired",
    category: "enterprise_ai",
    provider: "Network",
    description: "AI-powered network infrastructure and analytics",
    definition: "Network Catalyst AI delivers intelligent network operations with predictive analytics and automated remediation for enterprise networks.",
    color: "#049FD9",
    template: "<div class='component network-catalyst' data-type='network-catalyst'><i class='fas fa-network-wired'></i> Network Catalyst AI</div>",
    properties: {
      deployment_mode: {
        type: "select" as const,
        label: "Deployment Mode",
        options: ["On-premises", "Cloud", "Hybrid"],
        default: "Hybrid"
      },
      analytics_level: {
        type: "select" as const,
        label: "Analytics Level",
        options: ["Basic", "Advanced", "Premium"],
        default: "Advanced"
      }
    }
  },
  "network-umbrella-ai": {
    id: "network-umbrella-ai",
    name: "Network Umbrella AI",
    icon: "fas fa-shield-alt",
    faIcon: "fas fa-shield-alt",
    category: "enterprise_ai",
    provider: "Network",
    description: "AI-powered cloud security and threat protection",
    definition: "Network Umbrella AI uses machine learning to provide predictive threat intelligence and automated security responses for cloud-delivered security.",
    color: "#049FD9",
    template: "<div class='component network-umbrella-ai' data-type='network-umbrella-ai'><i class='fas fa-shield-alt'></i> Network Umbrella AI</div>",
    properties: {
      protection_level: {
        type: "select" as const,
        label: "Protection Level",
        options: ["Essentials", "Advantage", "Complete"],
        default: "Advantage"
      },
      policy_enforcement: {
        type: "select" as const,
        label: "Policy Enforcement",
        options: ["DNS", "IP", "URL", "Full"],
        default: "Full"
      }
    }
  }
};
