import mongoose, { connect } from "mongoose";

export const connectToDataBase = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongodb connected to host : -", connectionInstance.connection.host);
        
    } catch (error) {
        console.log("Error connecting to db in db file",error);
        process.exit(1)
    }
}