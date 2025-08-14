import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token){
            console.log("User not logged in | token not found");
            return res.status(401).json({
                error: "Token not found"
            })
        }
        const decoded = jwt.verify(token, process.env.JSON_SECRET_KEY)
        if(!decoded){
            console.log("Invalid token found | login from user end");
            return res.status(401).json(
                {
                    error: "Invalid Token found"
                }
            )
        }
    
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            console.log("User not found in database");
            return res.status(401).json({
                error: "User doesnt exit | not found in database"
            })
        }
        req.user = user
        // const {fullName, username, gender, avatar} = user;
        // res.status(201).json({
        //     message: "User retrieved successfully",
        //     fullName,
        //     username,
        //     gender,
        //     avatar
        // })
        next();
    } catch (error) {
        console.log("Error in protectRoute function: ", error.message);
        res.status(501).json({
            error: "Internal Server Error"
        })
    }
}