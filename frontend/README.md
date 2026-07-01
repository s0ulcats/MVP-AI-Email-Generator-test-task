# AI Email Generator Frontend

A modern Next.js 14 frontend for an AI-powered email generation SaaS application. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context (Auth)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Dashboard page (protected)
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── pricing/             # Pricing page
│   ├── profile/             # Profile page (protected)
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx             # Landing page
│   └── error.tsx            # Error boundary
├── components/              # Reusable components
│   ├── app/                 # Dashboard-specific components
│   │   ├── app-nav.tsx     # App navigation header
│   │   ├── email-generator.tsx
│   │   ├── history-list.tsx
│   │   ├── profile-card.tsx
│   │   └── result-panel.tsx
│   ├── auth/               # Authentication components
│   │   ├── auth-shell.tsx
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── marketing/          # Landing page components
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── faq.tsx
│   │   ├── cta.tsx
│   │   └── pricing-cards.tsx
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities and API clients
│   ├── api/               # API client functions
│   └── constants.ts       # App constants
├── providers/             # React context providers
│   └── auth-provider.tsx  # Authentication context
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware for route protection
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3001`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Features

### Landing Page
- Hero section with call-to-action
- Features showcase
- FAQ section
- Pricing cards
- Responsive design

### Authentication
- User registration with validation
- User login with JWT tokens
- Protected routes with middleware
- Auto token refresh
- Secure logout

### Dashboard
- Email topic input
- Tone selection (Professional, Casual, Friendly, etc.)
- Length selection (Short, Medium, Long)
- AI-powered email generation
- Generation history
- Real-time loading states

### Pricing
- Three-tier pricing (Free, Pro, Premium)
- Plan upgrade functionality
- Current plan indicator

### Profile
- View user information
- Update profile details

### Error Handling
- Global error boundary
- User-friendly error messages
- Toast notifications
- No white screens

## Authentication Flow

1. User registers/logs in
2. Backend returns access + refresh tokens
3. Tokens stored in HTTP-only cookies
4. AuthProvider manages user state
5. Middleware protects dashboard/profile routes
6. Auto-refresh on token expiration

## API Integration

The frontend communicates with the NestJS backend through:

- `lib/api/auth.ts` - Authentication endpoints
- `lib/api/user.ts` - User profile endpoints
- `lib/api/generate.ts` - Email generation endpoints
- `lib/api/subscription.ts` - Subscription management
- `lib/api/client.ts` - Axios client with interceptors

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Adaptive navigation
- Touch-friendly UI components
- Optimized layouts for all screen sizes

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t ai-email-generator-frontend .

# Run container
docker run -p 3001:3000 --env-file .env.local ai-email-generator-frontend
```

### Docker Compose

The project includes Docker Compose configuration in the backend for full-stack deployment.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

UNLICENSED