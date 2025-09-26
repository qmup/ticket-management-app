# Step 1: Dependencies & Configuration

## Overview

Setup the foundational dependencies and configuration for the ticket management app using modern React ecosystem tools.

## Tech Stack Decisions & Rationale

### State Management: Zustand

**Tại sao chọn Zustand?**

- **Lightweight**: Chỉ ~2KB, không cần boilerplate như Redux
- **TypeScript-first**: Excellent TypeScript support out of the box
- **Simple API**: Dễ học và sử dụng, không cần Provider wrapping
- **Performance**: Chỉ re-render components khi state thực sự thay đổi
- **Perfect for small-medium apps**: Phù hợp với scope của assignment này

### Data Fetching: React Query (TanStack Query)

**Tại sao chọn React Query?**

- **Caching**: Tự động cache data, tránh duplicate requests
- **Background updates**: Tự động refetch data khi cần
- **Loading states**: Built-in loading, error states
- **Optimistic updates**: Hỗ trợ update UI trước khi API response
- **Race condition handling**: Xử lý tốt các trường hợp user click nhanh
- **Perfect với artificial delay**: API có intentional delay, React Query sẽ handle tốt

### Styling: Tailwind CSS + shadcn/ui

**Tại sao chọn combo này?**

- **Tailwind CSS**: Utility-first, responsive design dễ dàng, consistent spacing/colors
- **shadcn/ui**:
  - Copy-paste components (không phải npm dependency)
  - Built on Radix UI (accessibility-first)
  - Fully customizable với Tailwind
  - TypeScript support
  - Modern, professional look

### Routing: React Router (đã có sẵn)

- Đã được setup trong project
- Phù hợp cho 2 screens: list và detail

## Implementation

### Installing Dependencies

```bash
# State management
yarn add zustand

# Data fetching
yarn add @tanstack/react-query

# Styling
yarn add -D tailwindcss postcss autoprefixer
yarn add class-variance-authority clsx tailwind-merge

# shadcn/ui dependencies
yarn add @radix-ui/react-slot
yarn add lucide-react
```

### Why these specific packages?

- **@tanstack/react-query**: Latest version of React Query
- **class-variance-authority**: For component variants (shadcn/ui requirement)
- **clsx & tailwind-merge**: Utility functions for conditional classes
- **@radix-ui/react-slot**: Base component for shadcn/ui
- **lucide-react**: Icon library used by shadcn/ui

### Configuration Files Created

1. **tailwind.config.js**: Configured to scan client/src for Tailwind classes
2. **postcss.config.js**: Setup PostCSS with Tailwind and Autoprefixer
3. **client/src/styles.css**: Added Tailwind directives
4. **client/src/lib/utils.ts**: Utility function for class merging (shadcn/ui standard)
5. **Basic shadcn/ui components**: Button, Card, Input components

### Why this setup?

- **Tailwind CSS**: Utility-first approach, perfect for rapid prototyping
- **shadcn/ui components**: Copy-paste approach means no bundle bloat
- **TypeScript support**: All components are fully typed
- **Responsive by default**: Tailwind's mobile-first approach

## Files Created/Modified

### New Files:

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `client/src/lib/utils.ts` - Utility functions for class merging
- `client/src/components/ui/button.tsx` - Button component
- `client/src/components/ui/card.tsx` - Card component
- `client/src/components/ui/input.tsx` - Input component

### Modified Files:

- `package.json` - Added new dependencies
- `yarn.lock` - Updated lock file
- `client/src/styles.css` - Added Tailwind directives

## Commit

```
feat: setup dependencies and configuration
```

## Next Steps

Ready for Step 2: State Management & API Layer setup.
