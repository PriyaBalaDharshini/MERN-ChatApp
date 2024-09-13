import asyncHandler from 'express-async-handler';
import MessageModel from '../models/messageModel.js';
import UserModel from '../models/userModel.js';
import ChatModel from '../models/chatModel.js';

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400);
    }

    // a new message need this from body
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await MessageModel.create(newMessage);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await UserModel.populate(message, {
            path: "chat.users",
            select: "name email pic"
        })

        await ChatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.status(201).json(message)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await MessageModel.find({ chat: req.params.chatId })
            .populate("sender", "name, pic, email")
            .populate("chat")

        res.status(200).json(messages)

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})



export default { sendMessage, allMessages }