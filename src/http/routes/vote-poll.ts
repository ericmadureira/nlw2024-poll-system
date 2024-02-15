import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'
import { voting } from '../../utils/voting-pub-sub'

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

    const previousVote = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          pollId,
          sessionId
        }
      }
    })

    if(previousVote && (pollOptionId !== previousVote.pollOptionId)) {
      await prisma.vote.delete({
        where: {
          id: previousVote.id
        }
      })
      const voteCountDecremented = await redis.zincrby(pollId, -1, previousVote.pollOptionId)

      voting.publish(pollId, {
        pollOptionId: previousVote.pollOptionId,
        votes: Number(voteCountDecremented),
      });
    }

    await prisma.vote.create({
      data: {
        pollId,
        pollOptionId,
        sessionId
      }
    })
    await redis.zincrby(pollId, 1, pollOptionId)

    const voteCountIncremented = await redis.zincrby(pollId, 1, pollOptionId);

    voting.publish(pollId, { pollOptionId, votes: Number(voteCountIncremented) });

    return reply.status(201).send()
  })
}