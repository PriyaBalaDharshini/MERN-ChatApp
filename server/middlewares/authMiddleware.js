import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_CODE)

            req.user = await UserModel.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, Token Not Valid")
        }
    }
    if (!token) {
        res.status(401)
        throw new Error("Not authorized, No Token")
    }
})
export default protect;