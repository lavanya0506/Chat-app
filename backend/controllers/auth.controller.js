import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/jwt.utils.js";
import { io } from "../socket/socket.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, gender, confirmPassword } = req.body;


        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match!!" })
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(4);
        const hashedPassword = await bcrypt.hash(confirmPassword, salt)

        
        const boyAvatarUrl = `https://avatar.iran.liara.run/public/boy?username=${username}`
        
        const girlAvatarUrl = `https://avatar.iran.liara.run/public/girl?username=${username}`
        
        const newUser = new User({
            fullName,
            username,
            password: String(hashedPassword),
            gender,
            avatar: gender === 'male' ? boyAvatarUrl : girlAvatarUrl
        })
        
        await newUser.save()
        const token = await generateAccessToken(newUser._id, res);

        io.emit("newUser", newUser._id);

        return res.status(201).json({
            message: "user created successfully",
            _id: newUser._id,
            fullName: fullName,
            username: username,
            gender: gender,
            avatar: newUser.avatar,
            accessToken: token
        })
        
    } catch (error) {
        return res.status(500).json({
            error: "Some internal server error",
            errorMessage: `${error.message} ${error.type}, ${error.stack}`
        })
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
    
        const user = await User.findOne({username})
        const {gender, avatar} = user

        if(!user){
            return res.status(400).json({
                error: "user not found"
            })
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                error: "Incorrect Password"
            })
        }

        const token = await generateAccessToken(user._id, res);
        console.log("logged in successfully");
        res.status(201).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            gender,
            avatar,
            accessToken: token
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "login function Internal error"
        })
    }
}

export const logout = (req, res) => {
    try {
        if(!req.cookies || !req.cookies.jwt === undefined){
            return res.status(401).json({
                error: "No User logged In"
            })
        }
        res.cookie("jwt", "", {maxAge: 0});
        res.status(201).json({
            message: "logged out successfully"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "logout function Internal error"
        })
    }
}