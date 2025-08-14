import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getRecieverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        const senderFullName = req.user.fullName
        
        const {message} = req.body;
        const {id: recieverId} = req.params;
        

        if(!userId){
            console.log("Enter user id");
            return res.status(401).json({
                message: "Enter valid userId"
            })
        }
    
        if(!message){
            console.log("Enter a message");
            return res.status(401).json({
                error: "Enter a valid message"
            })
        }
    
        let conversation = await Conversation.findOne({users: {$all: [userId, recieverId]}}).select("-password")
    
        const checkRecieverId = await User.findById(recieverId);
        const recieverFullName = checkRecieverId.fullName
        if(!checkRecieverId){
            console.log("reciever id is not valid");
            return res.status(401).json({
                error: "Enter a valid reciver"
            })
        }
    
        if(!conversation){
            conversation = new Conversation({
                users: [userId, recieverId]
            })
        }
        const newMessage = new Message({
            sender: userId,
            reciever: recieverId,
            message
        })
        conversation.conversation.push(newMessage._id)
        await Promise.all([newMessage.save(), conversation.save()])
        
        const recieverSocketId = getRecieverSocketId(recieverId)

        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        console.log(newMessage);

        res.status(201).json({
            message: "new message pushed into conversation",
            sentMessage: newMessage.message,
            sender: senderFullName,
            reciever: recieverFullName,
            newMessage
        })
    } catch (error) {
        console.log("Error in send Message Function : ", error.message);
        res.status(501).json({
            error: "Internal Server Error"
        })
    }
}
export const getMessage = async (req, res) => {
    try {
        const {_id: senderId, fullName: senderFullName} = req.user
        const {id: recieverId} = req.params

        const checkRecieverId = await User.findById(recieverId)

        if(!checkRecieverId){
            console.log("Invalid reciever Id selected");
            return res.status(401).json({
                error: "Invalid reciever Id | reciever Id not found in database" 
            })
        }

        const recieverFullName = checkRecieverId.fullName

        const convers = await Conversation.findOne({users: {$all: [senderId, recieverId]}}).populate("conversation").select("conversation");

        if(!convers){
            console.log("The users did not have any past conversations");
            return res.status(201).json({
                message: "Conversation among users fetched successfully",
                sender: senderFullName,
                recieverFullName: recieverFullName,
                senderId,
                recieverId,
                conversationMessages: []
            })
        }

        res.status(201).json({
            message: "Conversation among users fetched successfully",
            sender: senderFullName,
            recieverFullName: recieverFullName,
            senderId,
            recieverId,
            conversationMessages: convers.conversation
        })
    } catch (error) {
        console.log("Error in get Message Function: ", error.message);
        res.status(501).json({
            error: "Internal Server Error"
        })
    }
}