import { createServer } from 'http';
import { Server } from 'socket.io';
import {EventEmitter} from "events";

export function createSocketServer() {
    const httpServer = createServer();
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
        },
    });

    httpServer.listen(8090);
    console.log("Socket.io server is running...")
    return io.on('connection', (socket) => socket);
}

export let client = createSocketServer();
export let emitter = new EventEmitter();
