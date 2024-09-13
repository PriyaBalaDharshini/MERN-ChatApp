import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
dotenv.config();
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

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

app.listen(PORT, () => { console.log(`Backend Running on ${PORT}`); })