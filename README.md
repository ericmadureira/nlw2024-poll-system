# Node + Redis Poll API
This live poll API was made with Node v20.11.0 and Fastify framework, it has Postgres for data storage and Redis for caching results, Prisma ORM to make queries and storage easier, and a pub/sub structure with Websockets to keep track of vote count.

## How to run
This application was containerized with Docker, so make sure it's installed and running.
1. `npm install` to install dependencies
2. `npx prisma migrate dev` to create tables in DB
3. `docker compose up -d` to run Postgres and Redis in detached mode
4. `npm run dev` to start Node API
5. Now server is running on http://localhost:3616

## Architecture
- Postgres: stores polls in relational DB
- Redis: caches poll results
- Prisma: ORM for easier querying and a lot of extras
