# Maia

Personalized training app based on menstrual cycle.

## Project Structure

This project consists of two main parts:

1. **Frontend**: React Native mobile app with Expo
2. **Backend**: Node.js API with Fastify

## Technologies

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT and bcrypt
- **Notifications**: Firebase Cloud Messaging
- **Deployment**: Railway

## Setup

1. Install dependencies:

   ```bash
   npm run setup
   ```

2. Copy environment files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Start PostgreSQL locally:

   ```bash
   npm run db:up
   ```

4. Generate and apply database migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Start development servers:
   ```bash
   npm run dev
   ```

## Folder Structure

- `/frontend` - React Native mobile application
- `/backend` - Node.js API server
- `/docs` - Project documentation

## Useful Checks

```bash
npm --prefix frontend exec expo-doctor
npm --prefix backend run db:generate
npm --prefix backend audit --omit=dev
npm --prefix frontend audit --omit=dev
```
