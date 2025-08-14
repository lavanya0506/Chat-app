import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Connected to mongoDB database successfully");
    } catch (error) {
        console.log("Error while connecting to database", error.message);
    }
}
