import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
dotenv.config();
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { Server } from "socket.io";
import userController from "./controllers/userController.js";

const app = express();
const PORT = process.env.PORT || 8001
const DB = process.env.DB_URL

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes)
app.use("/chat", chatRoutes)
app.use("/message", messageRoutes)


mongoose
    .connect(DB)
    .then(() => console.log("Database Cnnection Successfull"))
    .catch((err) => console.log(err))

const server = app.listen(PORT, () => { console.log(`Backend Running on ${PORT}`); })

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        //console.log(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user Joined Room :" + room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMeaasgeReceived) => {
        var chat = newMeaasgeReceived.chat;

        if (!chat.users) return console.log("chat.users are not defined");
        chat.users.forEach(user => {
            if (user._id === newMeaasgeReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMeaasgeReceived);
        })
    })
    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(userData._id)
    })
})