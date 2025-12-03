export interface DataSource {
  id: number;
  name: string;
  type: string;
  format: string;
  dataVolume: string;
  updateFrequency: string;
  description: string;
}

export interface UploadedFile {
  id: number;
  name: string;
  type: string;
  size: number;
  file: File;
}

export interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface FormData {
  industryCategory: string;
  businessScenario: string;
  dataSources: DataSource[];
  uploadedFiles: UploadedFile[];
}