// User types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  plan: 'free' | 'pro' | 'enterprise';
  scansRemaining: number;
  scansThisMonth: number;
}

// Scan types
export type ScanType = 'url' | 'code' | 'file';
export type ScanStatus = 'pending' | 'scanning' | 'analyzing' | 'completed' | 'failed';

export interface ScanInput {
  type: ScanType;
  url?: string;
  code?: string;
  fileName?: string;
  fileContent?: string;
  language?: string;
}

export interface Scan {
  id: string;
  userId: string;
  type: ScanType;
  input: ScanInput;
  status: ScanStatus;
  createdAt: Date;
  completedAt?: Date;
  report?: ScanReport;
  error?: string;
}

// Vulnerability types
export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type VulnerabilityCategory =
  | 'XSS'
  | 'INJECTION'
  | 'AUTHENTICATION'
  | 'AUTHORIZATION'
  | 'CRYPTOGRAPHY'
  | 'DATA_EXPOSURE'
  | 'CONFIGURATION'
  | 'DEPENDENCIES'
  | 'CSRF'
  | 'CORS'
  | 'HEADERS'
  | 'INPUT_VALIDATION'
  | 'SESSION'
  | 'OTHER';

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  category: VulnerabilityCategory;
  location: {
    file?: string;
    line?: number;
    column?: number;
    snippet?: string;
  };
  cwe?: string;
  owasp?: string;
  cvss?: number;
  impact: string;
  remediation: string;
  codeExample?: {
    vulnerable: string;
    fixed: string;
  };
  references: string[];
}

// Report types
export interface SecurityScore {
  overall: number; // 0-100
  breakdown: {
    xss: number;
    injection: number;
    authentication: number;
    dataExposure: number;
    configuration: number;
    dependencies: number;
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface ScanReport {
  id: string;
  scanId: string;
  generatedAt: Date;
  score: SecurityScore;
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  vulnerabilities: Vulnerability[];
  scannedResources: {
    url?: string;
    files: string[];
    linesOfCode: number;
  };
  recommendations: string[];
  headers?: HeaderAnalysis;
  dependencies?: DependencyAnalysis[];
}

export interface HeaderAnalysis {
  present: string[];
  missing: string[];
  misconfigured: {
    header: string;
    issue: string;
    recommendation: string;
  }[];
}

export interface DependencyAnalysis {
  name: string;
  version: string;
  latestVersion?: string;
  vulnerabilities: {
    id: string;
    severity: VulnerabilitySeverity;
    title: string;
  }[];
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ScanRequest {
  type: ScanType;
  url?: string;
  code?: string;
  language?: string;
  fileName?: string;
}

// Rate limiting
export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}
