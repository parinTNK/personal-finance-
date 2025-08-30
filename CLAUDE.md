# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.2 application using React 19 with the App Router architecture, TypeScript, and Tailwind CSS v4. The project uses Turbopack for enhanced build performance.

## Development Commands

- `npm run dev` - Start development server (uses Turbopack)
- `npm run build` - Create production build (uses Turbopack) 
- `npm run start` - Start production server

**Note**: No testing, linting, or formatting scripts are currently configured.

## Architecture

### App Router Structure
- Uses `src/app/` directory for the App Router pattern
- Root layout in `src/app/layout.tsx` implements Geist font family
- Path alias: `@/*` maps to `./src/*`
- Metadata API used for SEO configuration

### Key Files
- `src/app/page.tsx` - Main home page component
- `src/app/layout.tsx` - Root layout with font loading and metadata
- `src/app/globals.css` - Global styles with Tailwind imports and CSS custom properties
- `next.config.ts` - Minimal Next.js configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind v4
- `.env.local` - Environment variables for Supabase configuration
- `database.types.ts` - Generated TypeScript types from Supabase schema

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **React**: Version 19 (latest)
- **Database**: Supabase integration with `@supabase/supabase-js`
- **TypeScript**: Strict configuration enabled
- **Styling**: Tailwind CSS v4 with `@theme inline` syntax
- **Fonts**: Optimized Google Fonts (Geist Sans and Mono)
- **Build Tool**: Turbopack for faster compilation

## Development Patterns

### Styling
- Uses Tailwind CSS v4 modern syntax
- Dark mode implemented via CSS custom properties and `prefers-color-scheme`
- Theme variables defined in `globals.css`

### TypeScript
- Strict mode enabled with comprehensive type checking
- ES2017 target configuration
- Next.js TypeScript plugin integrated

### Performance Optimizations
- Next.js Image component with priority loading
- Automatic font optimization via `next/font/google`
- Turbopack enabled for development and production builds

## Supabase Integration

### Database Setup
- Uses Supabase as the backend database with real-time capabilities
- TypeScript types are generated from the database schema using: `npx supabase gen types typescript --project-id <project-id> > database.types.ts`
- Environment variables in `.env.local` configure the Supabase connection

### Authentication
- Authentication through Supabase CLI requires login: `npx supabase login`
- For non-interactive environments, use `--token` flag or `SUPABASE_ACCESS_TOKEN` environment variable

## File Structure
- `src/app/` - App Router pages and layouts
- `public/` - Static assets (SVG icons and images)
- `database.types.ts` - Generated Supabase schema types
- Root level configuration files for Next.js, TypeScript, and PostCSS