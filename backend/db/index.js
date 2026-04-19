const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}`,
        );
        console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('MONGODB connection FAILED', error);
        throw error;
    }
};

module.exports = connectDB;