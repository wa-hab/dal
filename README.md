# MushkilPay

simple full-stack financial transaction tracking app built with modern tech.

## overview

monorepo containing:

- frontend: react + typescript + vite app with tanstack router/query
- backend: express + typescript + drizzle orm api

## quick start

quickstarts and more info for both projects are in their respective readme files

## features

- track credit/debit transactions
- view history + totals
- responsive design
- dark mode ready
- type-safe forms
- optimistic updates
- skeleton loading states

## warning

this is a BASIC demo app. needs auth, better error handling, and security controls before production use.

## structure

```
.
├── frontend/            # react frontend
│   ├── src/
│   │   ├── routes/     # pages/routes
│   │   ├── components/ # ui components
│   │   └── lib/        # utils, hooks, types
│   └── ...
│
└── backend/            # express api
    ├── src/
    │   ├── routes/      # api routes
    │   ├── repository/  # database interactions
    │   └── lib/         # utils + types
    └── ...
