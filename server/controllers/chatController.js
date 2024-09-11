import asyncHandler from 'express-async-handler';
import ChatModel from '../models/chatModel.js';
import UserModel from '../models/userModel.js';

//it is responsible for creating or accessing a chat with resect to logged in user and id with which we are going to creat a chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    console.log("UserId received from request body:", userId); // Log the userId

    if (!userId) {
        console.log("UserId param not sent");
        return res.status(400).json({ message: "UserId param not sent" });
    }

    try {
        var isChat = await ChatModel.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        console.log("Existing chat found:", isChat); // Log the found chat

        isChat = await UserModel.populate(isChat, {
            path: "latestMessage.sender",
            select: "name email pic",
        });

        if (isChat.length > 0) {
            console.log("Returning existing chat:", isChat[0]);
            res.status(200).send(isChat[0]);
        } else {
            console.log("No chat found. Creating new chat...");
            var chatData = {
                chatName: "sender",
                isGroup: false,
                users: [req.user._id, userId],
            };

            const createdChat = await ChatModel.create(chatData);
            const fullChat = await ChatModel.findOne({ _id: createdChat._id })
                .populate("users", "-password");

            console.log("New chat created:", fullChat);
            res.status(200).send(fullChat);
        }
    } catch (error) {
        console.error("Error accessing or creating chat:", error);
        res.status(400).json({ message: error.message });
    }
});


//Fetching all the user for a perticular chat
const fetchChat = asyncHandler(async (req, res) => {
    try {
        console.log("Fetching chats for user:", req.user._id); // Log the user ID

        const chats = await ChatModel.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("groupAdmin", "-password")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await UserModel.populate(results, {
                    path: "latestMessage.sender",
                    select: "name email pic",
                });
                res.status(200).send(results)
            })

        console.log("Fetched chats:", chats); // Log the fetched chats
        res.status(200).send(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(400).json({ message: error.message });
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users); // Parse the users array from request body

    if (users.length < 2) {
        return res.status(400).send("More than 2 users required for a group chat");
    }

    users.push(req.user); // Add the logged-in user to the users array

    try {
        const groupChat = await ChatModel.create({
            chatName: req.body.name,
            users: users, // Use the updated users array
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(201).json(fullGroupChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body

    const updateChatName = await ChatModel.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updateChatName) {
        res.status(400)
        throw new Error("Chat Not Found")
    } else {
        res.status(200).json(updateChatName)
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body

    const added = await ChatModel.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!added) {
        res.status(400)
        throw new Error("Chat Not Found")
    } else {
        res.status(200).json(added)
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body

    const removed = await ChatModel.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!removed) {
        res.status(400)
        throw new Error("Chat Not Found")
    } else {
        res.status(200).json(removed)
    }
})

export default { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup }