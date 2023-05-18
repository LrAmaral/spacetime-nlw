/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt: 'asc',
      }
    })

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(), // o id é um objeto que espera que seja string
    })

    const { id } = paramsSchema.parse(request.params) // validação para ver se ele segue a estrutura do dado

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })
    return memory 
  })

  // coerce vai comparar tudo com false, '', null, undefined, 0

  app.post('/memories', async (request  ) => {
    const bodySchema = z.object({
      content: z.string(), // o id é um objeto que espera que seja string
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const {content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic, 
        userId: 'e07fd609-ebd0-4344-8668-a6d84db935ef'       
       },
    })
     
    return memory
  })

  app.put('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.body)

    const bodySchema = z.object({
      content: z.string(), // o id é um objeto que espera que seja string
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
 
    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content, 
        coverUrl, 
        isPublic, 
       }
    })
    return memory
  })

  app.delete('/memories/:id', async (request) => { 
    const paramsSchema = z.object({
    id: z.string().uuid(), // o id é um objeto que espera que seja string
  })

  const { id } = paramsSchema.parse(request.params) // validação para ver se ele segue a estrutura do dado

  await prisma.memory.delete({
      where: {
        id,
      }
    })
  })
}
