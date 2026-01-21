import React from 'react';

export enum DealStage {
  NEW_INQUIRY = 'New Inquiry',
  RATE_SENT = 'Rate Sent',
  NEGOTIATION = 'Negotiation',
  ACCEPTED_AWAITING_UPFRONT = 'Accepted Awaiting Upfront',
  TOOL_ACCESS_GRANTED = 'Tool Access Granted',
  UPFRONT_RECEIVED = 'Upfront Received',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export enum ProjectStage {
  TOOL_ACCESS = 'Tool Access', // For sponsored
  TESTING_RESEARCH = 'Testing & Research',
  CONCEPT = 'Concept & Research', // For tutorials
  SCRIPTING = 'Scripting',
  FILMING = 'Filming & Screen Cap',
  EDITING = 'Voiceover & Editing',
  REVIEW = 'Review Pending',
  FINAL_PAYMENT = 'Final Payment',
  PUBLISHED = 'Published',
}

export type ProjectType = 'SPONSORED' | 'TUTORIAL';

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
  dealId?: string; // Optional for tutorials
  type: ProjectType;
  title: string;
  brandName: string; // For tutorials, this might be "Self" or the topic
  stage: ProjectStage;
  dueDate: string;
  upfrontPaid: boolean;
  finalPaid: boolean;
  totalValue: number; // 0 for tutorials
  progress: number; // 0-100
  scriptUrl?: string;
  videoUrl?: string;
  archived?: boolean;
  cancelled?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  stage: ProjectStage;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  totalChapters: number;
  chapters: Chapter[];
  progress: number;
  thumbnailUrl?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

export type ViewState = 'DASHBOARD' | 'DEALS' | 'PROJECTS' | 'TUTORIALS' | 'COURSES' | 'FINISHED_PROJECTS' | 'PAYMENTS' | 'INSIGHTS' | 'SETTINGS';