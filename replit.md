# BT Play — Luxury Soft Play Hire

A premium luxury toddler soft play hire website for BT Play, designed for birthdays, christenings, weddings, and luxury family events. The platform is built as a production-ready booking and marketing website with architecture for future Stripe, Brevo, Resend, and Groq integrations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/bt-play run dev` — run the frontend (port 20697)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (packages, testimonials, enquiries, contacts, newsletter)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/bt-play/src/` — React frontend (pages, components, theme)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validation schemas

## Architecture decisions

- OpenAPI-first contract: all API shapes defined in `openapi.yaml`, then codegen produces Zod schemas (server) and React Query hooks (client)
- Backend structured for future integrations: env var placeholders ready for `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `BREVO_API_KEY`, `RESEND_API_KEY`, `GROQ_API_KEY`
- Booking references generated server-side with `BTP-XXXXXX` format
- Enquiry status pipeline: enquiry_received → quote_sent → awaiting_deposit → deposit_paid → confirmed → event_complete
- Newsletter has unique email constraint for idempotent subscribes (returns 409 on duplicate)

## Product

- **Home page**: hero, philosophy section, featured packages, gallery preview, trust features, testimonials carousel, social section, final CTA
- **Packages page**: detailed comparison of 4 packages (Classic Luxury, Signature, Deluxe Celebration, Bespoke Luxury) with features, add-ons, age ranges
- **Gallery page**: luxury image showcase with category filtering (Birthdays, Christenings, Weddings, Indoor, Outdoor, Neutral, Pastel)
- **About page**: brand story, values, safety commitment
- **FAQ page**: accordion FAQ with 9 questions
- **Contact page**: luxury enquiry form with booking reference generation

## Future integrations (architecture ready)

- **Stripe**: deposit/full payments, webhook handlers for booking status updates
- **Brevo**: marketing emails, newsletter CRM, abandoned enquiry follow-ups
- **Resend**: transactional emails (booking confirmations, payment receipts, admin notifications)
- **Groq**: AI smart booking assistant, FAQ chatbot, enquiry summarisation

## Admin Dashboard

- Route: `/btarea` (excluded from Layout, has its own header)
- Login: `btadmin` / `#btadminpass26#`
- API: all admin routes at `/api/admin/*`, protected by Bearer token auth (`adminAuthMiddleware`)
- Session stored in `admin_sessions` DB table (24hr expiry)
- Tabs: Enquiries, Calendar, Reviews, FAQ, Gallery, Marketing
- Marketing emails sent via Brevo to all enquiry/contact/newsletter emails

## Packages

- **Premium** — £100: bouncy castle + play pen + ball pit + birthday decor, up to 10 children, 3hrs, no extras
- **Luxury** — £180 (recommended): all Premium + extra toys/shapes/mats, up to 20 children, personalised decor, +£20/hr, +£15/extra child

## Delivery Charges

- Free: AL, HP, SG, WD postcodes (Hertfordshire)
- +£15: EN, LU, MK, CM, CB, HA, UB, IG, RM (nearby areas)
- +£50: all other postcodes (20+ miles)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any `openapi.yaml` change, run `pnpm --filter @workspace/api-spec run codegen` then `pnpm run typecheck:libs` before building
- Array columns in Drizzle: use `.array()` method — `text("tags").array()`, not `array(text(...))`
- Express 5 wildcard routes need names: `/{*splat}` not `*`
- `pnpm run typecheck:libs` must run after schema changes to rebuild `@workspace/db` declarations before API server typecheck

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
