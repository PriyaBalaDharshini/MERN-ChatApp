import mongoose from "mongoose"

const chatSchema = mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" //user Model
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message" //mesage Model
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    { timestamps: true }
)

const ChatModel = mongoose.model("Chat", chatSchema)

export default ChatModel;