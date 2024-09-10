import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/3899/3899618.png"
    }
},
    { timestamps: true }
)


const UserModel = mongoose.model("User", userSchema)

export default UserModel;