# transaction service api

minimal express backend for handling financial transactions. built with typescript, drizzle orm, and postgresql.

## setup

```bash
# install deps
bun install

# set up env
cp .env.example .env
# add your postgres connection string

# run migrations
bun run migrate

# start dev server
bun run dev
```

## api endpoints

### GET /transactions
returns all transactions, ordered by most recent

### GET /transactions/:id
get transaction by id

### POST /transactions
create new transaction
```typescript
{
  amount: number,    // > 0
  type: "credit" | "debit",
  timestamp?: Date   // defaults to now
}
```

## dev

```bash
# generate new migration
bun run migrate:generate

# push migration
bun run migrate

# build
bun run build
```

## stack
- typescript
- express
- drizzle orm
- postgresql
- bun runtime
- zod validation

## warning

EXTREMELY basic rn. not production ready. needs security controls + features before going live.
