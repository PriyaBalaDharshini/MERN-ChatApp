import asyncHandler from 'express-async-handler';
import ChatModel from '../models/chatModel.js';
import UserModel from '../models/userModel.js';

//it is responsible for creating or accessing a chat with resect to logged in user and id with which we are going to creat a chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body //if a chat with this user id exists then return it or create a new chat
    if (!userId) {
        console.log("UserId param not sent");
        return res.status(400)
    }

    var isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }, //if the chat found populate the users array
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage")

    isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email pic"
    })

    if (isChat.length > 0) {
        res.status(200).send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroup: false,
            users: [req.user._id, userId]
        };
        try {
            const createdChat = await ChatModel.create(chatData)

            const fullChat = await ChatModel.findOne({ _id: createdChat._id })
                .populate("users", "-password")

            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

export default { accessChat }