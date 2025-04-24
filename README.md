# HabitHub

HabitHub is a modern habit tracking application that helps people build and stick to habits in a fun, rewarding, and social way.

## Features

- **Habit Tracking**: Easily create and track your daily, weekly, or monthly habits
- **Streak Building**: Maintain your habit streaks and earn achievements
- **Social Components**: Connect with friends, share progress, and encourage each other
- **Achievement System**: Earn badges and rewards as you develop consistent habits
- **Beautiful Interface**: Clean, modern UI that makes habit tracking enjoyable

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: Prisma ORM with SQLite (can be configured for PostgreSQL, MySQL)
- **Authentication**: NextAuth.js for secure user authentication

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/habithub.git
   cd habithub
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

4. Create a `.env.local` file with the following variables:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/styles`: Global CSS and utility styles

## Deployment

The application can be easily deployed to Vercel, Netlify, or any other platform that supports Next.js.

```
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 