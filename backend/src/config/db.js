// Used to switch between "mongodb" or "json"
const STORAGE_TYPE = process.env.STORAGE_TYPE || "mongodb";

import mongoose from 'mongoose';

const connectMongoDB = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project1';
    console.log('Attempting to connect to MongoDB...');
    console.log(`MongoDB URI: ${mongoUri.replace(/\/\/[^@]+@/, '//***:***@')}`);

    try {
        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000
        });

        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('⚙ Possible solutions:');
        console.error('1. Start MongoDB service:');
        console.error('   Windows: net start MongoDB');
        console.error('   Mac/Linux: sudo systemctl start mongod');
        console.error('2. Install MongoDB: https://www.mongodb.com/try/download/community');
        console.error('3. Check MONGODB_URI in .env file');
        throw error;
    }
};

const connectJSON = async () => {
    console.warn('JSON storage not supported in this build. Using MongoDB instead.');
};

const connectDB = async () => {
    try {
        if (STORAGE_TYPE === 'mongodb') {
            await connectMongoDB();
        } else if (STORAGE_TYPE === 'json') {
            await connectJSON();
        } else {
            console.warn('⚠ Unknown STORAGE_TYPE, defaulting to MongoDB.');
            await connectMongoDB();
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};

export default connectDB;
