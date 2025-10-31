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
    NOTIFICATIONS = 'Notifications',
    ADMIN = 'Admin',
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
}

export interface Contribution {
    id: number;
    memberId: number;
    amount: number;
    date: string;
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
    isAdmin: boolean;
    withdrawnProfit: number;
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
}

export enum TransactionStatus {
    COMPLETED = 'Completed',
    PENDING = 'Pending',
    FAILED = 'Failed',
}

export interface Transaction {
    id: number;
    description: string;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    amount: number;
}