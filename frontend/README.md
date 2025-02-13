# MushkilPay Frontend

react + typescript + vite frontend for a basic transaction tracking system. uses tanstack router + react-query

## stack

- react 19
- typescript
- vite
- tailwind
- shadcn/ui
- tanstack router + react-query
- axios
- react-hook-form + zod

## dev setup

```bash
pnpm i
pnpm dev
```

port defaults to 3001. backend needs to be running on 3000.

## features

- add credit/debit transactions
- view transaction history
- see totals
- responsive af
- dark mode ready
- type-safe forms
- optimistic updates
- skeleton loading states

## structure

- `/src/routes` - tanstack router pages
- `/src/components` - reusable components
- `/src/lib` - utils, hooks, types
- `/src/components/ui` - shadcn components
