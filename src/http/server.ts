import fastify from 'fastify'

import { createPoll } from './routes/create-poll'

const app = fastify()

app.register(createPoll)

app.listen({ port: 3616 }).then(() => {
  console.log('HTTP Server running on http://localhost:3616')
})
