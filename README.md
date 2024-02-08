# Next Level Week 2024 - Live Poll

## How to run
This application was containerized with Docker, so make sure it's installed and running.
1. `docker compose up -d` to run services in detached mode.
2. Server is running on http://localhost:3616.

## Architecture
- Postgres: stores polls in relational DB
- Redis: caches poll results
- Prisma: ORM for easier querying and a lot of extras

## Author
- Created and maintained by Eric Madureira.
