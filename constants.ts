import { Member, Role, Proposal, ProposalStatus, Investment, Contribution, Transaction, TransactionType, TransactionStatus, Notification, NotificationType, Event, EventStatus, BusinessListing, BusinessStatus, FinancialAssistanceRequest, AssistanceRequestStatus, WithdrawalRequest, WithdrawalStatus, Comment, Announcement, AnnouncementType } from './types';

export const MEMBERS: Member[] = [
    { id: 1, name: 'Admin User', avatarUrl: 'https://i.pravatar.cc/150?u=1', contributionStatus: 'Paid', role: Role.ADMIN, withdrawnProfit: 500, availableProfit: 250, email: 'admin@club.com', phone: '123-456-7890', bio: 'Founding member and administrator of the investment club.' },
    { id: 2, name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=2', contributionStatus: 'Paid', role: Role.TREASURER, withdrawnProfit: 250, availableProfit: 125, email: 'alice@club.com', phone: '123-456-7891', bio: 'Treasurer, managing the club\'s finances.' },
    { id: 3, name: 'Bob Williams', avatarUrl: 'https://i.pravatar.cc/150?u=3', contributionStatus: 'Pending', role: Role.MEMBER, withdrawnProfit: 100, availableProfit: 50, email: 'bob@club.com', phone: '123-456-7892', bio: 'Enthusiastic member focused on tech stocks.' },
    { id: 4, name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=4', contributionStatus: 'Paid', role: Role.MEMBER, withdrawnProfit: 150, availableProfit: 75, email: 'charlie@club.com', phone: '123-456-7893', bio: 'Member with a keen interest in renewable energy.' },
];

const PROPOSAL_COMMENTS: Comment[] = [
    { id: 1, authorId: 2, content: "I think this is a great idea. I've been following NVDA for a while.", timestamp: '2 days ago' },
    { id: 2, authorId: 3, content: "What's the entry price we're looking at?", timestamp: '1 day ago' },
];

export const PROPOSALS: Proposal[] = [
    { id: 1, title: 'Invest $2,000 in NVIDIA (NVDA)', description: 'Proposal to allocate $2,000 of our funds to purchase NVIDIA stock, given its strong performance in the AI sector.', proposedBy: 2, status: ProposalStatus.OPEN, votesFor: 1, votesAgainst: 0, votedIds: [2], comments: PROPOSAL_COMMENTS },
    { id: 2, title: 'Increase Monthly Contribution to $150', description: 'To accelerate our capital growth, I propose we increase the monthly contribution from $100 to $150 per member.', proposedBy: 1, status: ProposalStatus.PASSED, votesFor: 4, votesAgainst: 0, votedIds: [1, 2, 3, 4], comments: [] },
    { id: 3, title: 'Sell 50% of our position in META', description: 'Proposal to take some profits from our META investment.', proposedBy: 3, status: ProposalStatus.FAILED, votesFor: 1, votesAgainst: 2, votedIds: [1, 2, 3], comments: [] },
];

export const INVESTMENTS: Investment[] = [
    { id: 1, asset: 'Apple Inc.', ticker: 'AAPL', amountInvested: 5000, currentValue: 6200, shares: 32.5 },
    { id: 2, asset: 'Tesla, Inc.', ticker: 'TSLA', amountInvested: 3000, currentValue: 2800, shares: 12.0 },
    { id: 3, asset: 'iShares Core S&P 500 ETF', ticker: 'IVV', amountInvested: 8000, currentValue: 9500, shares: 19.8 },
];

export const INVESTMENT_HISTORY: { [key: string]: { date: string; value: number }[] } = {
    'AAPL': [
        { date: 'Jan', value: 170 }, { date: 'Feb', value: 180 }, { date: 'Mar', value: 175 },
        { date: 'Apr', value: 185 }, { date: 'May', value: 190 }, { date: 'Jun', value: 200 },
    ],
    'TSLA': [
        { date: 'Jan', value: 250 }, { date: 'Feb', value: 240 }, { date: 'Mar', value: 230 },
        { date: 'Apr', value: 220 }, { date: 'May', value: 235 }, { date: 'Jun', value: 233 },
    ],
    'IVV': [
        { date: 'Jan', value: 470 }, { date: 'Feb', value: 475 }, { date: 'Mar', value: 480 },
        { date: 'Apr', value: 485 }, { date: 'May', value: 490 }, { date: 'Jun', value: 495 },
    ],
};

export const CONTRIBUTIONS: Contribution[] = [
    { id: 1, memberId: 1, amount: 100, date: '2023-06-01' },
    { id: 2, memberId: 2, amount: 100, date: '2023-06-01' },
    { id: 3, memberId: 4, amount: 100, date: '2023-06-01' },
    { id: 4, memberId: 1, amount: 100, date: '2023-05-01' },
    { id: 5, memberId: 2, amount: 100, date: '2023-05-01' },
    { id: 6, memberId: 3, amount: 100, date: '2023-05-01' },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 1, memberId: 1, description: 'Monthly Contribution', type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: '2023-06-01', amount: 100 },
    { id: 2, memberId: 2, description: 'Investment in AAPL', type: TransactionType.INVESTMENT, status: TransactionStatus.COMPLETED, date: '2023-05-15', amount: -1000 },
    { id: 3, memberId: 1, description: 'Profit Withdrawal', type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING, date: '2023-05-10', amount: -50 },
    { id: 4, memberId: 4, description: 'Monthly Contribution', type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: '2023-05-01', amount: 100 },
    { id: 5, description: 'Dividend Reinvestment from IVV', type: TransactionType.REINVESTMENT, status: TransactionStatus.COMPLETED, date: '2023-04-20', amount: 25.50 },
];

export const NOTIFICATIONS: Notification[] = [
    { id: 1, message: "A new proposal 'Invest $2,000 in NVIDIA (NVDA)' has been created.", timestamp: '1 day ago', read: false, viewed: false, type: NotificationType.PROPOSAL },
    { id: 2, message: "Your monthly contribution of $100 has been successfully processed.", timestamp: '3 days ago', read: true, viewed: true, type: NotificationType.GENERAL },
    { id: 3, message: "The proposal 'Increase Monthly Contribution to $150' has passed.", timestamp: '5 days ago', read: true, viewed: true, type: NotificationType.PROPOSAL },
    { id: 4, message: "Upcoming event: 'Quarterly Review Meeting' on July 1st.", timestamp: '1 week ago', read: true, viewed: true, type: NotificationType.EVENT },
];

export const EVENTS: Event[] = [
    { id: 1, title: 'Quarterly Review Meeting', date: '2023-07-01', time: '18:00', location: 'Zoom (Link in description)', description: 'Discussing Q2 performance and Q3 outlook.', type: 'Online', status: EventStatus.APPROVED, submittedBy: 1, comments: [] },
    { id: 2, title: 'Tech Stocks Deep Dive', date: '2023-07-15', time: '19:00', location: '123 Main St, Anytown', description: 'Workshop focusing on emerging tech stocks.', type: 'In-Person', status: EventStatus.APPROVED, submittedBy: 3, comments: [] },
];

export const BUSINESS_LISTINGS: BusinessListing[] = [
    { id: 1, name: 'Alice\'s Web Dev', description: 'Freelance web development services, specializing in React and Node.js. Club member discount available.', ownerId: 2, website: 'https://example.com', contact: 'alice@club.com', status: BusinessStatus.APPROVED, comments: [] },
    { id: 2, name: 'Bob\'s Financial Consulting', description: 'Personal finance consulting for young professionals.', ownerId: 3, contact: 'bob@club.com', status: BusinessStatus.PENDING, comments: [] },
];

export const FINANCIAL_ASSISTANCE_REQUESTS: FinancialAssistanceRequest[] = [
    { id: 1, requesterId: 4, amount: 500, purpose: 'To cover an unexpected medical bill.', status: AssistanceRequestStatus.PENDING, votesFor: 1, votesAgainst: 0, votedIds: [1], requestDate: '2023-06-10', comments: [] },
];

export const INITIAL_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
    { id: 1, memberId: 1, amount: 50.00, date: '2023-05-10', status: WithdrawalStatus.PENDING, bankName: 'Chase', accountNumber: '...6789' },
    { id: 2, memberId: 1, amount: 120.00, date: '2023-04-02', status: WithdrawalStatus.COMPLETED, bankName: 'Bank of America', accountNumber: '...1234' },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, message: 'Welcome to the new ClubApp! All members are encouraged to update their profiles.', type: AnnouncementType.INFO, timestamp: '3 days ago' },
    { id: 2, message: 'URGENT: Monthly contributions for July are due by the 5th. Please ensure your payment is logged.', type: AnnouncementType.URGENT, timestamp: '1 day ago' },
];
