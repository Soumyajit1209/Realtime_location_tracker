const express = require('express')
const app = express()
const port = 3000
const http = require('http')
const path = require('path')
const server = http.createServer(app)


const socketIo = require('socket.io')
const io = socketIo(server)
io.on('connection', (socket) => {
    // Listen for 'send location' event
    socket.on('send location', function(data){
        io.emit("recieve location", {
            id: socket.id,
            ...data
        });
    })
  console.log('a user connected')
  
  socket.on('disconnect', () => {
    io.emit('user disconnected', socket.id)
  })
})

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index', { title: 'Socket.IO Example' })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
