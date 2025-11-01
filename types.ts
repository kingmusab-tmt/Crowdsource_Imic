import React from 'react';

export enum View {
    DASHBOARD = 'Dashboard',
    DEPOSIT = 'Deposit',
    WITHDRAWAL = 'Withdrawal',
    TRANSACTIONS = 'Transactions',
    INVESTMENTS = 'Investments',
    PROPOSALS = 'Proposals',
    ASSISTANCE = 'Assistance',
    MARKETPLACE = 'Marketplace',
    EVENTS = 'Events',
    DIRECTORY = 'Directory',
    NOTIFICATIONS = 'Notifications',
    PROFILE = 'Profile',
    ADMIN = 'Admin',
}

export enum Role {
    ADMIN = 'Admin',
    TREASURER = 'Treasurer',
    MEMBER = 'Member',
}

export enum CommentableItemType {
    PROPOSAL = 'proposal',
    BUSINESS_LISTING = 'business_listing',
    EVENT = 'event',
    ASSISTANCE_REQUEST = 'assistance_request',
}

export enum SearchResultType {
    MEMBER = 'Member',
    PROPOSAL = 'Proposal',
    INVESTMENT = 'Investment',
    EVENT = 'Event',
    BUSINESS = 'Business Listing',
}

export interface SearchResult {
    id: number | string;
    title: string;
    subtitle: string;
    type: SearchResultType;
    view: View;
}

export interface Comment {
    id: number;
    authorId: number;
    content: string;
    timestamp: string;
}

export enum ProposalStatus {
    OPEN = 'Open',
    PASSED = 'Passed',
    FAILED = 'Failed',
}

export interface Proposal {
    id: number;
    title: string;
    description: string;
    proposedBy: number;
    status: ProposalStatus;
    votesFor: number;
    votesAgainst: number;
    votedIds: number[];
    comments: Comment[];
}

export enum BusinessStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

export interface BusinessListing {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    website?: string;
    contact: string;
    status: BusinessStatus;
    comments: Comment[];
}

export enum EventStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

export interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    type: 'In-Person' | 'Online';
    status: EventStatus;
    submittedBy: number;
    comments: Comment[];
}

export enum NotificationType {
    EVENT = 'event',
    PROPOSAL = 'proposal',
    GENERAL = 'general',
}

export interface Notification {
    id: number;
    message: string;
    timestamp: string;
    read: boolean;
    viewed: boolean;
    type: NotificationType;
}

export enum AssistanceRequestStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

export interface FinancialAssistanceRequest {
    id: number;
    requesterId: number;
    amount: number;
    purpose: string;
    status: AssistanceRequestStatus;
    votesFor: number;
    votesAgainst: number;
    votedIds: number[];
    requestDate: string;
    comments: Comment[];
}

export interface Contribution {
    id: number;
    memberId: number;
    amount: number;
    date: string;
}

export interface ContributionGoal {
    targetAmount: number;
    deadline: string; // e.g., "YYYY-MM-DD"
}

export interface Investment {
    id: number;
    asset: string;
    ticker: string;
    amountInvested: number;
    currentValue: number;
    shares: number;
}

export interface Member {
    id: number;
    name: string;
    avatarUrl: string;
    contributionStatus: 'Paid' | 'Pending';
    role: Role;
    withdrawnProfit: number;
    availableProfit: number;
    email: string;
    phone: string;
    bio: string;
}

export interface Activity {
    id: number;
    description: string;
    timestamp: string;
    icon: React.ReactNode;
}

export interface FundUsage {
  id: number;
  description: string;
  amount: number;
  type: 'Investment' | 'Assistance';
  date: string;
}

export enum TransactionType {
    DEPOSIT = 'Deposit',
    WITHDRAWAL = 'Withdrawal',
    INVESTMENT = 'Investment',
    REINVESTMENT = 'Reinvestment',
    EXPENSE = 'Expense',
}

export enum TransactionStatus {
    COMPLETED = 'Completed',
    PENDING = 'Pending',
    FAILED = 'Failed',
}

export interface Transaction {
    id: number;
    memberId?: number;
    description: string;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    amount: number;
}

export enum WithdrawalStatus {
    COMPLETED = 'Completed',
    PENDING = 'Pending',
    REJECTED = 'Rejected',
}

export interface WithdrawalRequest {
    id: number;
    memberId?: number;
    amount: number;
    date: string;
    status: WithdrawalStatus;
    bankName: string;
    accountNumber: string; // Last 4 digits for display
}

export enum AnnouncementType {
    INFO = 'Info',
    URGENT = 'Urgent',
}

export interface Announcement {
    id: number;
    message: string;
    type: AnnouncementType;
    timestamp: string;
}
