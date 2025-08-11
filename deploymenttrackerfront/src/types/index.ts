// Tipos básicos para las entidades
export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  components?: Component[];
}

export interface Component {
  id: number;
  name: string;
  type: string;
  projectId: number;
  jiraTicket?: string;
  memoryAllocation?: string;
  timeout?: string;
  versions?: ComponentVersion[];
  checklistItems?: ChecklistItem[];
}

export interface ComponentVersion {
  id: number;
  componentId: number;
  environment: string;
  version: string;
  status: string;
  lastDeployDate?: string;
  deployedBy?: string;
}

export interface ChecklistItem {
  id: number;
  componentId: number;
  description: string;
  isCompleted: boolean;
  notes?: string;
  order: number;
}

// Tipos para formularios
export interface NewProject {
  name: string;
  description: string;
}

export interface NewComponent {
  name: string;
  type: string;
  jiraTicket: string;
  memoryAllocation: string;
  timeout: string;
  projectId: number;
}

export interface EditingVersion {
  componentId: number;
  componentName: string;
  environment: string;
  version: string;
  status: string;
  lastDeploy: string;
  deployedBy: string;
}

export interface DeleteTarget {
  id: number;
  name: string;
  type: 'project' | 'component';
}

// Tipos para API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}