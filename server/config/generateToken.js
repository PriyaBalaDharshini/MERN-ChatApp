import jwt from "jsonwebtoken"

export const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_CODE,
        { expiresIn: "30d" }
    )
}