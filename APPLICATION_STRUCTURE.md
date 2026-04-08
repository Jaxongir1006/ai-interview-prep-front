# AI Interview Preparation Platform - Application Structure

## Overview
A modern, premium-quality SaaS web application designed for software developers preparing for technical interviews. Built with React, TypeScript, Tailwind CSS, and featuring comprehensive dark/light mode support.

## Pages & Routes

### Public Pages
- `/` - Landing Page
  - Hero section with product value proposition
  - Feature highlights
  - Benefits showcase
  - Call-to-action sections

- `/login` - Login Page
  - Email/password authentication
  - Social login options (Google, GitHub)
  - Password reset link

- `/register` - Registration Page
  - User account creation
  - Terms acceptance
  - Social registration options

- `/password-reset` - Password Reset
  - Email-based password recovery
  - Success confirmation

- `/onboarding` - Onboarding Flow
  - Step 1: Target role selection
  - Step 2: Experience level
  - Step 3: Topic preferences
  - Progress indicator

### Application Pages (Protected)
All application pages are under `/app` route with shared layout (sidebar + top navigation):

- `/app` - Dashboard
  - Quick stats cards (interviews, scores, streak)
  - Performance chart
  - Weak/strong topics analysis
  - Recent activity
  - Start interview CTA

- `/app/interview` - Interview Session
  - Question-by-question interface
  - Timer and progress tracking
  - Answer input (text/code mode)
  - Question navigation
  - Hints and difficulty indicators

- `/app/results/:sessionId` - Results Page
  - Overall score visualization
  - Performance radar chart
  - Topic-by-topic breakdown
  - Strengths and weaknesses
  - Missing concepts identification
  - Detailed feedback per question
  - Recommendations

- `/app/analytics` - Analytics Dashboard
  - Filters (time range, topic)
  - Performance over time charts
  - Topic performance breakdown
  - Difficulty distribution
  - Time investment tracking
  - Weekly progress trends

- `/app/profile` - User Profile
  - Profile information management
  - Stats overview
  - Topic proficiency levels
  - Achievement badges
  - Preferred topics

- `/app/settings` - Settings
  - Account settings
  - Theme selection (light/dark/system)
  - Notification preferences
  - Security settings
  - Session management
  - Account deletion

## Design System

### Colors
- **Primary**: Blue (#2563eb) - Main brand color
- **Secondary**: Purple (#8b5cf6) - Accent color
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#dc2626)

### Theme Support
- Light mode (default)
- Dark mode
- System preference detection
- Persistent theme selection

### Components
All components from shadcn/ui library:
- Buttons, Cards, Inputs, Labels
- Dialogs, Alerts, Tooltips
- Progress bars, Charts
- Navigation components
- Form components

### Typography
- Clean, readable font hierarchy
- Consistent spacing
- Responsive text sizes

### Layout
- Desktop-first approach
- Responsive grid system
- Sidebar navigation (desktop)
- Mobile-responsive breakpoints

## Key Features

### Animations
- Page transitions with Motion
- Hover effects
- Loading states
- Smooth chart animations
- Micro-interactions

### Data Visualization
- Line/Area charts (performance over time)
- Bar charts (topic performance, time spent)
- Radar charts (skill assessment)
- Pie charts (difficulty breakdown)
- Progress bars and indicators

### User Experience
- Smooth navigation
- Loading skeletons
- Toast notifications
- Form validation
- Responsive design
- Keyboard shortcuts support

## Technical Stack
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Theme**: next-themes

## Mock Data
The application uses mock data for demonstration. In production, all data would be fetched from the Golang backend API.

## Future Enhancements
- Real-time interview feedback
- Video interview practice
- Peer interview sessions
- Interview scheduling
- Performance benchmarking
- Learning resources integration
