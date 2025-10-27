# Reporters Directory

just for testing

A modern, multilingual news management platform built with Next.js 15, featuring comprehensive content management, translation capabilities, and a beautiful user interface.

## 🌟 Features

### Core Functionality
- **Multilingual Support**: Full internationalization with support for English, Arabic, French, and Spanish
- **Content Management**: Complete CRUD operations for articles, topics, and tags
- **Translation System**: Advanced translation management with auto-translation capabilities
- **Staff Management**: User authentication and role-based access control
- **Responsive Design**: Mobile-first approach with modern UI components

### Technical Features
- **Next.js 15 App Router**: Latest Next.js features with App Router architecture
- **TypeScript**: Full type safety throughout the application
- **Shadcn UI**: Modern, accessible component library
- **TanStack Query**: Efficient data fetching and caching
- **Form Validation**: Zod schemas for robust form validation
- **Theme Support**: Dark/light mode with system preference detection
- **RTL Support**: Right-to-left language support for Arabic

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3002](http://localhost:3002)

## 🏗️ Project Structure

```
web/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Internationalized routes
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (home)/              # Public pages
│   │   └── layout.tsx           # Language-specific layout
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                      # Shadcn UI components
│   ├── articles/                # Article-specific components
│   ├── auth/                    # Authentication components
│   ├── layout/                  # Layout components
│   ├── shared/                  # Shared components
│   ├── staff/                   # Staff management components
│   ├── tags/                    # Tag management components
│   ├── topics/                  # Topic management components
│   └── translations/            # Translation components
├── constants/                    # Application constants
├── data/                        # Mock data and types
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── providers/                   # React context providers
├── schemas/                     # Zod validation schemas
├── services/                    # API service layer
├── translations/                # Internationalization files
├── types/                       # TypeScript type definitions
└── utils/                       # Utility functions
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query
- **Theme**: Next Themes

### Development Tools
- **Linting**: Biome
- **Package Manager**: pnpm
- **Font**: Geist Sans & Mono

## 🌐 Internationalization

The application supports multiple languages with full RTL support:

- **English** (en) - Default
- **Arabic** (ar) - RTL support
- **French** (fr)
- **Spanish** (es)

### Adding New Languages

1. Add language configuration to `constants/languages.ts`
2. Create translation files in `translations/[lang]/translations.json`
3. Update middleware configuration if needed

## 📱 Features Overview

### Public Features
- **Homepage**: Featured articles, latest news, topic exploration
- **News Section**: Article browsing and reading
- **Topic & Tag Pages**: Content categorization
- **Search**: Full-text search across articles
- **Language Switching**: Seamless language switching

### Admin Features (Authentication Required)
- **Dashboard**: Content management overview
- **Article Management**: Create, edit, delete articles with translations
- **Topic Management**: Organize content by topics
- **Tag Management**: Content tagging system
- **Staff Management**: User account management
- **Translation Management**: Multi-language content management

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack

# Production
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

## 🎨 UI Components

The project uses Shadcn UI components with custom styling:

- **Data Tables**: Sortable, filterable tables with pagination
- **Forms**: Validated forms with error handling
- **Dialogs**: Modal dialogs for CRUD operations
- **Navigation**: Responsive navigation with mobile support
- **Cards**: Article, topic, and tag display cards
- **Search**: Advanced search with filters

## 🔐 Authentication

The application includes:
- **Login/Logout**: Secure authentication flow
- **Protected Routes**: Middleware-based route protection
- **Role-based Access**: Different access levels for staff
- **Session Management**: Cookie-based session handling

## 📊 Data Management

### API Integration
- **Base Service**: Centralized API communication
- **Error Handling**: Comprehensive error management
- **Loading States**: Optimistic updates with loading indicators
- **Caching**: TanStack Query for efficient data caching

### Content Types
- **Articles**: News articles with rich content
- **Topics**: Content categorization
- **Tags**: Content labeling system
- **Staff**: User management
- **Translations**: Multi-language content

## 🚀 Deployment

### Environment Setup
1. Configure environment variables
2. Set up your API backend
3. Configure domain settings

### Build & Deploy
```bash
pnpm build
pnpm start
```
---

Built By BlendLab FZE.
