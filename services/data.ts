import { Deal, DealStage, Project, ProjectStage, Transaction } from '../types';

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'd-1',
    brandName: 'NexusAI',
    toolName: 'Nexus Generative Suite',
    contactEmail: 'partners@nexusai.com',
    value: 2500,
    stage: DealStage.NEGOTIATION,
    lastActivity: '2024-05-20',
    expectedPublishDate: '2024-06-15'
  },
  {
    id: 'd-2',
    brandName: 'VidGen',
    toolName: 'VidGen Pro',
    contactEmail: 'marketing@vidgen.io',
    value: 1800,
    stage: DealStage.NEW_INQUIRY,
    lastActivity: '2024-05-22',
  },
  {
    id: 'd-3',
    brandName: 'SoundScape',
    toolName: 'AudioCleaner AI',
    contactEmail: 'hello@soundscape.ai',
    value: 3000,
    stage: DealStage.ACCEPTED_AWAITING_UPFRONT,
    lastActivity: '2024-05-18',
    notes: 'Contract signed, waiting for invoice #004 payment.'
  },
  {
    id: 'd-4',
    brandName: 'CodeWiz',
    toolName: 'CodeWiz IDE',
    contactEmail: 'devrel@codewiz.com',
    value: 4500,
    stage: DealStage.RATE_SENT,
    lastActivity: '2024-05-21',
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-1',
    dealId: 'd-old-1',
    brandName: 'PhotoMagic',
    title: 'PhotoMagic AI Review',
    stage: ProjectStage.EDITING,
    dueDate: '2024-05-28',
    upfrontPaid: true,
    finalPaid: false,
    totalValue: 2000,
    progress: 75,
  },
  {
    id: 'p-2',
    dealId: 'd-old-2',
    brandName: 'DataSift',
    title: 'How to use DataSift for Analytics',
    stage: ProjectStage.SCRIPTING,
    dueDate: '2024-06-05',
    upfrontPaid: true,
    finalPaid: false,
    totalValue: 3200,
    progress: 30,
  },
  {
    id: 'p-3',
    dealId: 'd-old-3',
    brandName: 'Voiceify',
    title: 'Voiceify vs The World',
    stage: ProjectStage.PUBLISHED,
    dueDate: '2024-05-10',
    upfrontPaid: true,
    finalPaid: true,
    totalValue: 1500,
    progress: 100,
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    date: '2024-05-01',
    description: 'YouTube AdSense April',
    amount: 1250,
    type: 'INCOME',
    category: 'YouTube Partner'
  },
  {
    id: 't-2',
    date: '2024-05-03',
    description: 'Epidemic Sound Subscription',
    amount: 15,
    type: 'EXPENSE',
    category: 'Software Subscription'
  },
  {
    id: 't-3',
    date: '2024-05-05',
    description: 'Voiceify Sponsorship (Upfront)',
    amount: 750,
    type: 'INCOME',
    category: 'Sponsorship'
  },
  {
    id: 't-4',
    date: '2024-05-10',
    description: 'Editor Payment (Project P-3)',
    amount: 300,
    type: 'EXPENSE',
    category: 'Editing Services'
  },
  {
    id: 't-5',
    date: '2024-05-12',
    description: 'Notion Creator Course Sales',
    amount: 450,
    type: 'INCOME',
    category: 'Course Sales'
  },
  {
    id: 't-6',
    date: '2024-05-15',
    description: 'Midjourney Subscription',
    amount: 30,
    type: 'EXPENSE',
    category: 'Software Subscription'
  },
  {
    id: 't-7',
    date: '2024-05-20',
    description: 'Jasper AI Affiliate Payout',
    amount: 120,
    type: 'INCOME',
    category: 'Affiliate Payment'
  },
];