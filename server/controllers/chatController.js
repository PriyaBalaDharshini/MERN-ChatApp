import asyncHandler from 'express-async-handler';
import ChatModel from '../models/chatModel.js';
import UserModel from '../models/userModel.js';

//it is responsible for creating or accessing a chat with resect to logged in user and id with which we are going to creat a chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    // console.log("UserId received from request body:", userId); 

    if (!userId) {
        //  console.log("UserId param not sent");
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
        const chats = await ChatModel.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("groupAdmin", "-password")
            .sort({ updatedAt: -1 });

        const populatedChats = await UserModel.populate(chats, {
            path: "latestMessage.sender",
            select: "name email pic",
        });

        res.status(200).send(populatedChats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(400).json({ message: error.message });
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    // Parse the users array from request body
    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than 2 users required for a group chat");
    }

    // Add the logged-in user (req.user) to the users array
    users.push(req.user._id);

    try {
        // Create the group chat
        const groupChat = await ChatModel.create({
            chatName: req.body.name,
            users: users, // Use 'users' instead of 'uniqueUsers'
            isGroupChat: true,
            groupAdmin: req.user._id // The logged-in user is the admin
        });

        const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        // Send the created group chat as a response
        res.status(201).json(fullGroupChat);
    } catch (error) {
        // Handle errors
        res.status(400).json({ message: error.message });
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body
    // console.log('Received request to rename group:', { chatId, chatName });

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
        // console.log('Successfully updated chat name:', updateChatName);
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

const deleteGroup = asyncHandler(async (req, res) => {
    const { chatId } = req.body;

    try {
        const deletedGroup = await ChatModel.findByIdAndDelete(chatId);

        if (!deletedGroup) {
            return res.status(404).json({ message: "Group chat not found" }); // 404 if group not found
        }

        res.status(200).json({ message: "Group chat deleted successfully", deletedGroup }); // 200 if deleted successfully
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Failed to delete group", error: error.message }); // 500 for server errors
    }
});

export default { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup, deleteGroup }