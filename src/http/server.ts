import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { fastifyWebsocket } from '@fastify/websocket'

import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { votePoll } from './routes/vote-poll'
import { pollResults } from './websockets/poll-results'

const app = fastify()

// Handlers
app.register(cookie, {
  secret: 'nlw24-secret',
  hook: 'onRequest'
})
app.register(fastifyWebsocket)

// HTTP routes
app.register(createPoll)
app.register(getPoll)
app.register(votePoll)

// Websocket routes
app.register(pollResults)

app.listen({ port: 3616 }).then(() => {
  console.log('HTTP Server running on http://localhost:3616')
})
