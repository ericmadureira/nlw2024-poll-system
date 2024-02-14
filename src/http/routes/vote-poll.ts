import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'

export async function votePoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    // request body schema
    const votePollBody = z.object({
      pollOptionId: z.string()
    })
    const votePollParams = z.object({
      pollId: z.string(),
    })
    const { pollOptionId } = votePollBody.parse(request.body)
    const { pollId } = votePollParams.parse(request.params)

    let sessionId = request.cookies.sessionId
    if(!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // lasts for 30 days
        signed: true,
        httpOnly: true
      })
    }

    await prisma.vote.create({
      data: {
        pollId,
        pollOptionId,
        sessionId
      }
    })

    return reply.status(201).send()
  })
}