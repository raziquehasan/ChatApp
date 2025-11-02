import mongoose from "mongoose";

const dbConnect = async()=>{
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_CONNECT;
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI exists:', !!mongoUri);
        
        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables');
        }
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected Successfully");
    } catch (error) {
        console.log('MongoDB connection error:', error.message);
        console.error('Full error:', error);
    }
}
 

export default dbConnect