import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('new tweet', (tweet) => {
      socket.broadcast.emit('new tweet', tweet)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})

