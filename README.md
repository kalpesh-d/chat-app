# Chat Application

A modern real-time chat application built with Next.js, React, and Supabase. This application provides a seamless messaging experience with authentication and real-time updates.

## Features

- 🔐 User Authentication
- 💬 Real-time messaging
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure data handling with Supabase

## Tech Stack

- **Frontend Framework**: Next.js
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
- **Language**: TypeScript
- **Icons**: React Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account and project

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_url
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Builds the application for production
- `npm run start` - Runs the built application
- `npm run lint` - Runs ESLint for code linting

## Project Structure

```
chat-app/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── auth/        # Authentication related pages
│   └── login/       # Login page
├── components/      # Reusable React components
├── public/         # Static assets
├── utils/          # Utility functions
└── middleware.ts   # Next.js middleware
```