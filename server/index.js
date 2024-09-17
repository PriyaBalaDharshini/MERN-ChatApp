import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { Server } from "socket.io";


const app = express();
const PORT = process.env.PORT || 8001;
const DB = process.env.DB_URL;

const allowedOrigins = [
    'https://chatapplication-mernstack.netlify.app',
    'http://localhost:5173'
];
/* app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
})); */

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.options('*', cors());

app.use(express.json());
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

app.get("/", (req, res) => { res.send("Welcome to the backend server of Chat Application") });

mongoose.connect(DB).then(() => console.log("Database Connection Successful")).catch((err) => console.log(err));

const server = app.listen(PORT, () => { console.log(`Backend Running on ${PORT}`); });

const io = new Server(server, {
    cors: {
        origin: 'https://chatapplication-mernstack.netlify.app',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        const chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users are not defined");
        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});
