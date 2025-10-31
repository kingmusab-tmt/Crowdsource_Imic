import {
    Member,
    Contribution,
    Investment,
    Proposal,
    BusinessListing,
    Event,
    Notification,
    FinancialAssistanceRequest,
    ProposalStatus,
    BusinessStatus,
    EventStatus,
    NotificationType,
    AssistanceRequestStatus,
    FundUsage,
    Transaction,
    TransactionType,
    TransactionStatus,
} from './types';

export const MEMBERS: Member[] = [
    { id: 1, name: 'Admin User', avatarUrl: 'https://i.pravatar.cc/150?u=1', contributionStatus: 'Paid', isAdmin: true, withdrawnProfit: 50, email: 'admin@clubapp.com', phone: '123-456-7890', bio: 'Founding member and administrator for the Investment Club. Passionate about collaborative finance and technology.' },
    { id: 2, name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=2', contributionStatus: 'Paid', isAdmin: false, withdrawnProfit: 75, email: 'alice.j@clubapp.com', phone: '234-567-8901', bio: 'Web developer and UI/UX enthusiast. Excited to see our collective investments grow.' },
    { id: 3, name: 'Bob Williams', avatarUrl: 'https://i.pravatar.cc/150?u=3', contributionStatus: 'Pending', isAdmin: false, withdrawnProfit: 20, email: 'bob.w@clubapp.com', phone: '345-678-9012', bio: 'Backend engineer specializing in Python. I handle the data, you handle the decisions.' },
    { id: 4, name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=4', contributionStatus: 'Paid', isAdmin: false, withdrawnProfit: 100, email: 'charlie.b@clubapp.com', phone: '456-789-0123', bio: 'Financial consultant for a major firm. Here to share insights and learn from the group.' },
];

export const CONTRIBUTIONS: Contribution[] = [
    { id: 1, memberId: 2, amount: 100, date: '2023-10-01' },
    { id: 2, memberId: 3, amount: 100, date: '2023-10-01' },
    { id: 3, memberId: 1, amount: 100, date: '2023-10-02' },
    { id: 4, memberId: 4, amount: 100, date: '2023-10-03' },
    { id: 5, memberId: 2, amount: 100, date: '2023-09-01' },
    { id: 6, memberId: 1, amount: 100, date: '2023-09-01' },
];

export const INVESTMENTS: Investment[] = [
    { id: 1, asset: 'Apple Inc.', ticker: 'AAPL', amountInvested: 1000, currentValue: 1250, shares: 5.8 },
    { id: 2, asset: 'Invesco QQQ Trust', ticker: 'QQQ', amountInvested: 800, currentValue: 750, shares: 2.1 },
    { id: 3, asset: 'Vanguard S&P 500 ETF', ticker: 'VOO', amountInvested: 1200, currentValue: 1350, shares: 3.2 },
];

export const INVESTMENT_HISTORY: { [key: string]: { date: string, value: number }[] } = {
    'AAPL': [
        { date: '2023-01', value: 130 },
        { date: '2023-02', value: 145 },
        { date: '2023-03', value: 160 },
        { date: '2023-04', value: 170 },
        { date: '2023-05', value: 175 },
        { date: '2023-06', value: 185 },
    ],
    'QQQ': [
        { date: '2023-01', value: 280 },
        { date: '2023-02', value: 300 },
        { date: '2023-03', value: 320 },
        { date: '2023-04', value: 350 },
        { date: '2023-05', value: 360 },
        { date: '2023-06', value: 355 },
    ],
    'VOO': [
        { date: '2023-01', value: 370 },
        { date: '2023-02', value: 380 },
        { date: '2023-03', value: 400 },
        { date: '2023-04', value: 410 },
        { date: '2023-05', value: 420 },
        { date: '2023-06', value: 425 },
    ]
};

export const PROPOSALS: Proposal[] = [
    { id: 1, title: 'Invest in Apple (AAPL)', description: 'Proposal to allocate $1000 from our funds to purchase Apple Inc. stock.', proposedBy: 2, status: ProposalStatus.PASSED, votesFor: 3, votesAgainst: 1, votedIds: [1, 2, 3, 4] },
    { id: 2, title: 'Increase monthly contribution to $150', description: 'To accelerate our investment power, I propose we increase the monthly contribution from $100 to $150.', proposedBy: 3, status: ProposalStatus.OPEN, votesFor: 1, votesAgainst: 1, votedIds: [2, 3] },
    { id: 3, title: 'Sell QQQ position', description: 'Given the recent downturn, I suggest we sell our position in QQQ to cut losses.', proposedBy: 4, status: ProposalStatus.FAILED, votesFor: 1, votesAgainst: 3, votedIds: [1, 2, 3, 4] },
];

export const BUSINESS_LISTINGS: BusinessListing[] = [
    { id: 1, name: 'Alice\'s Web Design', description: 'Freelance web design and development services. Specializing in React and modern UI/UX.', ownerId: 2, website: 'https://example.com', contact: 'alice@example.com', status: BusinessStatus.APPROVED },
    { id: 2, name: 'Charlie\'s Consulting', description: 'Business strategy and financial consulting for startups.', ownerId: 4, website: 'https://example.com', contact: 'charlie@example.com', status: BusinessStatus.APPROVED },
    { id: 3, name: 'Bob\'s Backend Dev', description: 'Backend development services with Python/Django.', ownerId: 3, website: 'https://example.com', contact: 'bob@example.com', status: BusinessStatus.PENDING },
];

export const EVENTS: Event[] = [
    { id: 1, title: 'Quarterly Review Meeting', date: '2023-12-15', time: '18:00', location: 'Zoom (Link to follow)', description: 'Discussing Q4 performance and Q1 2024 strategy.', type: 'Online', status: EventStatus.APPROVED, submittedBy: 1 },
    { id: 2, title: 'End of Year Social', date: '2023-12-22', time: '19:00', location: 'The Local Pub', description: 'A casual get-together to celebrate the year.', type: 'In-Person', status: EventStatus.PENDING, submittedBy: 2 },
];

export const NOTIFICATIONS: Notification[] = [
    { id: 1, message: 'Charlie Brown just posted a new event: "End of Year Social". Check it out!', timestamp: '2 days ago', read: false, viewed: false, type: NotificationType.EVENT },
    { id: 2, message: 'A new proposal "Increase monthly contribution to $150" has been created.', timestamp: '3 days ago', read: true, viewed: true, type: NotificationType.PROPOSAL },
    { id: 3, message: 'Welcome to ClubApp! Your dashboard is ready.', timestamp: '1 week ago', read: true, viewed: true, type: NotificationType.GENERAL },
];

export const ASSISTANCE_REQUESTS: FinancialAssistanceRequest[] = [
    { id: 1, requesterId: 3, amount: 500, purpose: 'Emergency car repairs needed to commute to work.', status: AssistanceRequestStatus.PENDING, votesFor: 1, votesAgainst: 0, votedIds: [2], requestDate: '2023-10-28' },
    { id: 2, requesterId: 4, amount: 250, purpose: 'To cover an unexpected medical bill.', status: AssistanceRequestStatus.APPROVED, votesFor: 4, votesAgainst: 0, votedIds: [1,2,3,4], requestDate: '2023-09-15' },
];

export const FUND_USAGE: FundUsage[] = [
  { id: 1, description: 'Invested in Apple Inc. (AAPL)', amount: 1000, type: 'Investment', date: '2023-10-15' },
  { id: 2, description: 'Financial assistance for Charlie Brown', amount: 250, type: 'Assistance', date: '2023-09-16' },
  { id: 3, description: 'Invested in Vanguard S&P 500 ETF (VOO)', amount: 1200, type: 'Investment', date: '2023-09-05' },
  { id: 4, description: 'Invested in Invesco QQQ Trust (QQQ)', amount: 800, type: 'Investment', date: '2023-08-21' },
];

export const BANKS: string[] = [
    'JPMorgan Chase',
    'Bank of America',
    'Wells Fargo',
    'Citibank',
    'U.S. Bank',
    'PNC Bank',
    'TD Bank',
    'Capital One'
];

export const TRANSACTIONS: Transaction[] = [
    { id: 1, description: 'Card deposit via Monnify', type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: '2024-08-12', amount: 250.00 },
    { id: 2, description: 'Bank Transfer Deposit', type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: '2024-07-15', amount: 100.00 },
    { id: 3, description: 'Withdrawal to JPMorgan Chase', type: TransactionType.WITHDRAWAL, status: TransactionStatus.COMPLETED, date: '2024-07-10', amount: -50.00 },
    { id: 4, description: 'Reinvested profit', type: TransactionType.REINVESTMENT, status: TransactionStatus.COMPLETED, date: '2024-07-05', amount: 75.25 },
    { id: 5, description: 'Investment in Apple (AAPL)', type: TransactionType.INVESTMENT, status: TransactionStatus.COMPLETED, date: '2024-06-20', amount: -1000.00 },
    { id: 6, description: 'Automated Deposit', type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: '2024-06-01', amount: 100.00 },
    { id: 7, description: 'Withdrawal Request', type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING, date: '2024-08-13', amount: -123.45 },
];