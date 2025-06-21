# Integration Test Database Setup

These frontend tests mock API requests by default. To run the application against a real backend database instead, follow these steps:

1. Install MySQL and create a database named `learning_english_app_test`.
2. Import the SQL scripts from the `SQLScripts/` directory to populate schema and seed data.
   ```bash
   mysql -u root -p learning_english_app_test < SQLScripts/schema.sql
   mysql -u root -p learning_english_app_test < SQLScripts/core.data.sql
   # ... import other *.sql files as needed
   ```
3. Copy `.env.test` to `.env.development` and update the MySQL credentials if necessary.
4. Start the backend API:
   ```bash
   npm run dev:server
   ```
5. Run the frontend dev server or tests normally.

The mocked fetch logic will be bypassed when the application is executed in a real browser pointing at your running API.
