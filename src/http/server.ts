import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'

const app = fastify()

app.register(cookie, {
  secret: 'nlw24-secret',
  hook: 'onRequest'
})
app.register(createPoll)
app.register(getPoll)

app.listen({ port: 3616 }).then(() => {
  console.log('HTTP Server running on http://localhost:3616')
})
