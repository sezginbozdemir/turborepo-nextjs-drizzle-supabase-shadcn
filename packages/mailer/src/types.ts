export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface EmailData {
  to: string | string[];
  subject: string;
  template?: string;
  html?: string;
  data?: Record<string, any>;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
}

export interface EmailResult {
  recipients: string;
  accepted: string[];
  rejected: string[];
  pending: string[];
  messageId: string;
  response: string;
}

export interface BulkEmailResult {
  total: number;
  successful: number;
  failed: number;
  results: EmailResult[];
}

export interface TemplateData {
  [key: string]: any;
}
