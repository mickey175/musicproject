import { createServer,STATUS_CODES } from 'http';
import { Server } from 'socket.io';
import {EventEmitter} from "events";
import {fetchMicStream} from "./micRecorder.js";

const httpServer = createServer((req, res) => {
    if (req.method !== 'GET') {
        res.end(`{"error": "${STATUS_CODES[405]}"}`)
    } else {
        if (req.url === '/') {
            console.log("Server request is accepted... ")
            fetchMicStream();
        }
    }
    res.end(`{"error": "${STATUS_CODES[404]}"}`)
});

export function createSocketServer() {
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
