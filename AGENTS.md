# ONMEET

AI 화상회의 플랫폼 — 회의에만 집중하고, 나머지는 AI가 처리합니다.

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons
- **Deploy**: Netlify (SPA)
- **API**: External API server (`https://api.onmeet.cloud`)

## Project Structure

```
client/
├── app/                  # App entry point (App.tsx, global.css, main.tsx)
├── features/             # Feature-based modules
│   ├── auth/             # Authentication (api, context, hooks, pages)
│   ├── dashboard/        # Dashboard (components, pages)
│   ├── meeting/          # Meeting room (api, components, hooks, pages)
│   ├── schedule/         # Calendar & scheduling
│   ├── settings/         # User & company settings
│   └── team/             # Team management
├── shared/               # Shared across features
│   ├── components/       # Layout, Sidebar, MeetingHeader, etc.
│   ├── contexts/         # ThemeContext
│   ├── hooks/            # use-mobile, use-toast
│   ├── lib/              # utils, firebase, styles
│   └── ui/               # Reusable UI components (button, card, input, etc.)
└── pages/                # Top-level pages (Landing, NotFound)
```

## SPA Routing

Routes are defined in `client/app/App.tsx` using `react-router-dom`.

## Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/app/global.css`
- **UI components**: Pre-built library in `client/shared/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge`

Path aliases:
- `@/*` — Client folder

## Development Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm typecheck  # TypeScript validation
pnpm test       # Run Vitest tests
```
