import React from 'react';

export enum DealStage {
  NEW_INQUIRY = 'New Inquiry',
  RATE_SENT = 'Rate Sent',
  NEGOTIATION = 'Negotiation',
  ACCEPTED_AWAITING_UPFRONT = 'Accepted Awaiting Upfront',
  UPFRONT_RECEIVED = 'Upfront Received',
  REJECTED = 'Rejected',
}

export enum ProjectStage {
  TOOL_ACCESS = 'Tool Access',
  TESTING = 'Testing & Research',
  FILMING = 'Filming & Screen Cap',
  SCRIPTING = 'Scripting',
  EDITING = 'Voiceover & Editing',
  REVIEW = 'Review Pending',
  FINAL_PAYMENT = 'Final Payment',
  PUBLISHED = 'Published',
}

export type IncomeCategory = 'YouTube Partner' | 'Affiliate Payment' | 'Link Placement' | 'Course Sales' | 'Digital Products' | 'Sponsorship' | 'Other';
export type ExpenseCategory = 'Software Subscription' | 'Editing Services' | 'Equipment/Tools' | 'Freelancers' | 'Marketing' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: IncomeCategory | ExpenseCategory;
}

export interface Deal {
  id: string;
  brandName: string;
  toolName: string;
  contactEmail: string;
  value: number;
  stage: DealStage;
  lastActivity: string; // ISO Date
  expectedPublishDate?: string;
  notes?: string;
}

export interface Project {
  id: string;
  dealId: string;
  title: string;
  brandName: string;
  stage: ProjectStage;
  dueDate: string;
  upfrontPaid: boolean;
  finalPaid: boolean;
  totalValue: number;
  progress: number; // 0-100
  scriptUrl?: string;
  videoUrl?: string;
  archived?: boolean;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

export type ViewState = 'DASHBOARD' | 'DEALS' | 'PROJECTS' | 'FINISHED_PROJECTS' | 'PAYMENTS' | 'INSIGHTS' | 'SETTINGS';