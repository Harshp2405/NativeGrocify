import express from "express";
import http from "http"
import cors from "cors";
import {Server} from "socket.io";
import "dotenv/config";

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server , {
    cors:{
        origin:"*",
        methods:["*"],
    }
})

const updateRoomPresence = (roomId) => {
    if (!roomId) return;
    const room = io.sockets.adapter.rooms.get(roomId);
    const clientIds = room ? Array.from(room) : [];
    io.to(roomId).emit("room-presence", clientIds);
};

io.on('connection' , (socket)=>{
    console.log(`Connected : ${socket.id}`)

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        socket.currentRoom = roomId;
        console.log(`Client joined room: ${roomId}`);
        updateRoomPresence(roomId);
    });

    socket.on('item-add' , ({roomId , item})=>{
        socket.to(roomId).emit('item-added' , item)
    })

    socket.on('item-Update' , ({roomId , item})=>{
        socket.to(roomId).emit('item-Updated' , item)
    })
    socket.on('item-Delete' , ({roomId , item})=>{
        socket.to(roomId).emit('item-Deleted' , item)
    })

    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
        console.log(`👤 Client left room: ${roomId}`);
        updateRoomPresence(roomId);
    });

    socket.on("send-message", ({ roomId, message }) => {
        socket.to(roomId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
       console.log(`❌ Client disconnected: ${socket.id}`);
       if (socket.currentRoom) {
           updateRoomPresence(socket.currentRoom);
       }
     });

})

const PORT = 9000;
server.listen(PORT , ()=>{ console.log("Server IO connected " , PORT) })