import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB Database connected");
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`);
        
    } catch (error) {
        console.error(error.message);
    }
};

export default connectDB;
