import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'Hello World!'
})

app.listen({ port: 3616 }).then(() => {
  console.log('HTTP Server running on http://localhost:3616')
})
