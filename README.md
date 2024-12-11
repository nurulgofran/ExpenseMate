# ExpenseMate

ExpenseMate is a web application designed to simplify managing and settling shared expenses within groups.  
It supports creating event-based groups, adding expenses with flexible splits, and automating final settlement calculations.  
Users can see who owes whom and easily access bank details for manual transfers.

## Setup Instructions
- Backend:
  - `cd backend`
  - `npm install`
  - Set up PostgreSQL database and update `config/default.json` accordingly.
  - `npm run migrate`
  - `npm run seed` (if seeds are provided)
  - `npm start`

- Frontend:
  - `cd frontend`
  - `npm install`
  - `npm start` (Assuming a webpack dev server configured)

## Main Features
- User registration and login
- Create and join groups without explicit invitations
- Add expenses with equal or custom splits
- Automatically compute simplified settlements
- Real-time updates when new expenses are added

## Technology Stack
- Frontend: React, React Router
- Backend: Node.js, Express.js, Socket.io for real-time
- Database: PostgreSQL with Knex.js
- Authentication: JWT-based

## Future Improvements
- More robust UI/UX for managing custom splits
- Better error handling and input validation
- Enhanced security and scalability