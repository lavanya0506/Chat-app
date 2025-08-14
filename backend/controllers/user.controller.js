import { User } from "../models/user.model.js";
export const getUsersSidebar = async (req, res) => {
    try {
        const {_id: userId} = req.user;
    
        const filteredUsers = await User.find({_id: {$ne: userId}})
    
        if(!filteredUsers){
            console.log("filtered User list not found for sidebar");
            return res.status(401).json({
                error: "filtered users not found in database"
            })
        }

        res.status(201).json({
            filteredUsers
        })
    } catch (error) {
        console.log("error in getUsersSidebar function: ", error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }  
}