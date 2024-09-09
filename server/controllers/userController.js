import asyncHandler from 'express-async-handler'
import UserModel from '../models/userModel.js';
import { generateToken } from '../config/generateToken.js';


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill all required feilds")
    }
    const userExists = await UserModel.findOne({ email })

    if (userExists) {
        res.status(400).send("User exists already")

    }

    const user = await UserModel.create({
        name, email, password, pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic, //after successfull registration need to create token with user id
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Something went wrong. Please try againg")
    }

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Email or Password")
    }


})

export default { registerUser, loginUser }