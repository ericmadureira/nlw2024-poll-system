import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    // Schema for request query params
    const createPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = createPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if(!poll){
      return reply.status(400).send({ message: 'Poll not found.' })
    }

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

    const votes = result.reduce((acc, line, index) => {
      if(index % 2 === 0){
        const score = Number(result[index+1])
        Object.assign(acc, { [line]: score })
      }
      return acc
    }, {} as Record<string, number>)

    return reply.status(200).send({
      poll: {
        pollId: poll.id,
        title: poll.title,
        options: poll.options.map(option => ({
          optionId: option.id,
          title: option.title,
          votes: votes[option.id] || 0
        })),
      }
    })
  })
}