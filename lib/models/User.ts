import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    defaultExportFormat?: 'pdf' | 'html' | 'markdown';
  };
}

export interface UserSession {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
  ipAddress?: string;
}
