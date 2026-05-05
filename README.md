# Content Broadcasting System Frontend

A professional Content Broadcasting System built with Next.js, TypeScript, and shadcn/ui. Designed for educational environments to manage and broadcast content to students.

## Features

- **Authentication**: Role-based login for Teachers and Principals.
- **Teacher Dashboard**: Upload subject-based content with scheduling and file previews.
- **Principal Dashboard**: Comprehensive workflow to approve or reject content with reasons.
- **Live Broadcast Page**: A public-facing live page (`/live/:teacherId`) that automatically displays approved content during its scheduled window.
- **Dark Mode**: High-fidelity dark mode support using shadcn/ui.
- **Responsive Design**: Fully functional on mobile, tablet, and desktop devices.
- **Rich Aesthetics**: Smooth animations (Framer Motion) and premium UI components.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) + React Context
- **Forms**: React Hook Form + Zod
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites
- [Bun](https://bun.sh/) (Recommended) or Node.js

### Installation
1. Install dependencies:
   ```bash
   bun install
   ```

### Running Locally
1. Start the development server:
   ```bash
   bun run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Teacher** | `teacher@school.com` | `password123` |
| **Principal** | `principal@school.com` | `password123` |

## Project Structure

- `app/`: Next.js pages and layouts.
- `components/`: UI components and common patterns.
- `services/`: API abstraction layer.
- `context/`: Authentication state management.
- `types/`: Type definitions for content and users.
- `lib/`: Configuration and utility functions.

## Documentation
See [Frontend-notes.txt](./Frontend-notes.txt) for detailed architectural decisions.
sources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
