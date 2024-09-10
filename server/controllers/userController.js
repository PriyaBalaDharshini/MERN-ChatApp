import asyncHandler from 'express-async-handler';
import UserModel from '../models/userModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
        return res.status(400).send({ message: "Please fill all required fields" });
    }

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        return res.status(400).send("User already exists");
    }

    // Hash the password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        pic
    });

    // If user is created successfully
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic
        });
    } else {
        res.status(400);
        throw new Error("Something went wrong. Please try again.");
    }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email does not exist. Please register" });
    }

    // Compare the provided password with the stored hashed password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(400).json({ message: "Incorrect password" });
    }

    // Exclude password from the response
    const { password: _, ...info } = user._doc;

    // Generate access token upon successful login
    const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_CODE, { expiresIn: '50d' });

    // Respond with user info and access token
    res.status(200).json({ message: "Login successful.", ...info, accessToken });
});

// /user?search=priya
const allUsers = asyncHandler(async (req, res) => {

    const keyWord = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } }, //regex helping in matching the string from query with mongo db
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {}

    const users = await UserModel.find(keyWord).find({ _id: { $ne: req.user._id } }) //execept the current logged in user return other users
    res.status(200).send(users)

});


export default { registerUser, loginUser, allUsers };
