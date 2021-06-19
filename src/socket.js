import { createServer } from 'http';
import { Server } from 'socket.io';


export function createSocketServer() {
    const httpServer = createServer();
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
        },
    });

    httpServer.listen(8090);
    return io.on('connection', (socket) => socket);
}
