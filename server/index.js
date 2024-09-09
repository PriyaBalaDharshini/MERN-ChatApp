import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
dotenv.config();

import { chats } from "./data/data.js"

const app = express();
const PORT = process.env.PORT || 8001

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is Running")
})

app.get("/chat", (req, res) => {
    res.send(chats)
})

app.get("/chat/:id", (req, res) => {

    //const Id = req.params.id
    const singleChat = chats.find((chat) => chat._id === req.params.id)
    console.log(singleChat);
    res.send(singleChat)
})

app.listen(PORT, () => { console.log(`Backend Running on ${PORT}`); })