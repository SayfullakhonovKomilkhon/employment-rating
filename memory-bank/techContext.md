# Technical Context

## Technology Stack
- **Framework**: Next.js 15.3.5 (App Router)
- **React Version**: 19.0.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 + tailwindcss-animate
- **UI Components**: Radix UI components (comprehensive set)
- **Icons**: Lucide React, Heroicons, Tabler Icons
- **Animation**: Framer Motion
- **State Management**: React Hooks (useState, useCallback, useMemo)
- **Data Persistence**: Browser LocalStorage
- **Development**: ESLint, TypeScript strict mode

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirects to login)
│   ├── login/page.tsx     # Authentication page
│   ├── dashboard/page.tsx # Main dashboard
│   └── employees/         # Employee CRUD pages
├── components/            # Reusable components
│   ├── ui/               # Radix UI component library
│   ├── StarRating.tsx    # Custom rating component
│   └── SkillsInput.tsx   # Skills management component
├── hooks/                # Custom React hooks
│   └── useEmployees.ts   # Employee data management
└── lib/                  # Utility functions
    └── utils.ts          # cn() and other helpers
```

## Component Architecture
- **Compound Components**: Using Radix UI patterns
- **Custom Hooks**: Centralized state management with useEmployees
- **TypeScript**: Full type safety with interfaces for Employee, Rating
- **Responsive Design**: TailwindCSS utility classes with mobile-first approach

## Data Models
```typescript
type Employee = {
  id: number;
  name: string;
  title: string;
  department: string;
  skills: string[];
  image: string;
  notes?: string;
  ratings: Rating[];
}

type Rating = {
  id: number;
  rating: number; // 1-5
  comment: string;
  author: string;
  date: string; // YYYY-MM-DD
}
```

## Current Implementation Patterns
- Client-side rendering with "use client"
- LocalStorage for data persistence with seed data
- Custom hooks for data operations (CRUD)
- Responsive grid layouts (1-col mobile, 2-col tablet, 3-col desktop)
- Search filtering with real-time updates
