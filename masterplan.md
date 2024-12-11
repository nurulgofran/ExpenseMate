# masterplan.md

## Overview and Objectives
This web application aims to simplify the process of managing and settling shared expenses within groups of friends or acquaintances participating in specific events (e.g., trips, parties, household expenses). It will allow users to create event-based groups, record expenses, and automatically calculate simplified final settlements, reducing confusion and the need for multiple small transactions.

## Target Audience
- Groups of friends traveling together, organizing events, or sharing living expenses.
- Housemates looking to manage regular shared costs.
- Any group of individuals needing a clear, fair system to split expenses associated with a single event.

## Core Features and Functionality

### User Accounts and Authentication
- **Account Creation**: Users must register and provide:
  - Basic personal details (username, email, password).
  - Bank account information (for later display to other group members when settling debts).
- **Basic Security**: Passwords securely stored and authenticated. Basic account protection is enough at this stage.

### Group/Event Management
- **Event-Centric Groups**: Users create a group to represent a single event (e.g., “Spain Trip 2024”).
- **Adding Members**: The group creator can directly add other registered users to the group without their explicit consent (intended use for trusted circles of friends).
- **Group Lifecycle**: Each group is temporary—once the event is finished and all debts are settled, the group’s purpose is complete.

### Expense Entry and Splitting
- **Adding Expenses**: Any group member can add an expense with:
  - A brief description (e.g., “Dinner at Local Restaurant”).
  - The total amount (in Euros).
- **Flexible Splitting**:
  - By default, the expense can be divided equally among selected members of the group.
  - Advanced splitting allows custom amounts per member for cases where costs are not shared equally.
  - This ensures support for scenarios like partial participation or differing contributions.

### Real-Time Updates
- **Instant Synchronization**: Changes to expenses, group compositions, and calculations should appear in real-time to all members viewing the event page, ensuring everyone sees the most up-to-date information.

### Settlement Calculation
- **Automated Calculation**: At the end of the event, the application calculates how much each member owes or is owed.
- **Simplification of Debts**: The app will minimize the number of transactions. For example:
  - Instead of X owing Y and Y owing Z separately, the app might consolidate everything so that X directly pays Z, reducing complexity.
- **Result Display**: Users see a clear summary of who should pay whom and how much.

### Payment Details Display
- **Bank Account Info**: For each payee, their bank account details are displayed so that debtors can manually transfer the owed amount.
- **Manual Payments**: The app does not process payments directly. It simply provides the necessary details to complete transactions outside the platform.

## High-Level Technical Stack Recommendations

### Platform
- **Web Application**: Accessible on desktops, tablets, and mobile browsers. Initially focused on responsive web access.

### Frontend
- **Modern Web Framework**: Consider a framework like React, Vue, or Svelte.
- **UI Principles**:
  - Clean, minimalistic interface.
  - Clear navigation and straightforward forms.
  - Responsive layout for various devices.

### Backend
- **Server-Side Framework**: Any reputable server-side technology (e.g., Node.js, Ruby on Rails, or a serverless approach).
- **Data Handling**:
  - Relational database for structured data (e.g., PostgreSQL or MySQL).
  - Tables for users, groups, expenses, and expense splits.
- **Real-Time Updates**:
  - WebSockets or a similar real-time communication method to update all clients instantly.

## Conceptual Data Model
- **Users**:
  - `id, name, email, hashed_password, bank_details`
- **Groups**:
  - `id, name, creator_id, created_at`
- **Group Memberships**:
  - `id, group_id, user_id`
- **Expenses**:
  - `id, group_id, payer_id, description, total_amount, created_at`
- **Expense Splits**:
  - `id, expense_id, user_id, amount_owed`
- **Settlements** (calculated dynamically, might not need persistent storage unless storing final results):
  - Potentially a computed view or a table to store final owed amounts.

## User Interface Design Principles
- **Simplicity**:
  - A dashboard listing all groups the user is part of.
  - Within a group view: a table of expenses, each with details and splits.
  - A settlement page: clearly shows who owes whom and how much.
- **Minimal Visual Clutter**:
  - Neutral color scheme, minimal icons, focus on text clarity.
- **Intuitive Interaction**:
  - Straightforward forms for adding expenses.
  - Clear buttons for settling calculations and viewing bank details.

## Security Considerations
- **Basic Measures**:
  - Secure password storage (e.g., bcrypt or similar).
  - HTTPS to protect data in transit.
- **Data Privacy**:
  - Only show bank details to group members who need them at settlement time.
- **Potential Future Enhancements**:
  - Two-factor authentication for higher security.
  - More granular permissions if group complexity grows.

## Development Phases or Milestones

1. **MVP**:
   - User registration/login.
   - Create groups, add members.
   - Add and view expenses with equal splits.
   - Compute basic settlement without simplification.

2. **Enhanced Splitting**:
   - Introduce custom splitting logic.
   - Implement automated debt simplification.

3. **Real-Time Features**:
   - Add WebSocket or similar to update expense lists and settlements in real-time.

4. **UI/UX Improvements**:
   - Display bank details in settlement results.
   - Refine and improve the interface based on user feedback.

## Potential Challenges and Solutions

- **Complex Split Calculations**:
  - **Challenge**: Handling various custom splits accurately.
  - **Solution**: Define a robust data model and test calculation logic extensively.

- **Real-Time Synchronization**:
  - **Challenge**: Ensuring all users see updates instantly without page refresh.
  - **Solution**: Use reliable real-time frameworks or libraries. Test under load.

- **Scalability**:
  - **Challenge**: As groups might reach 50 members, ensuring performance and swift calculations is important.
  - **Solution**: Index database queries, consider caching or precomputing certain views, and ensure efficient data structures.

## Future Expansion Possibilities
- **Multiple Currencies**:
  - Introduce currency conversion and support a broader international audience.
- **Mobile App**:
  - Develop dedicated native or hybrid mobile apps once the web platform is stable.
- **Data Export**:
  - Allow exporting final settlement data as CSV or PDF for record-keeping or archiving.

---