import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

app.register(cors, {
  origin: true, // todas urls de front end poderão acessar o nosso backend
})
app.register(memoriesRoutes)

// Porta para o localhost, em ambiente de desenvolvimento

app
  .listen({
    port: 3333,
  })
  .then(() => {
    // Assim que meu servidor estiver no ar, eu quero então executar uma função
    console.log('🚀 HTTP server running on http://localhost:3333')
  })
