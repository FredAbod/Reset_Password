const mongoose = require('mongoose');
const { NODE_ENV, MONGODB_URI_DEV, MONGODB_URI_PROD } = process.env;
    const db = NODE_ENV == 'development' ? MONGODB_URI_DEV: MONGODB_URI_PROD;

const connectDB = async () => {
    const conn = await mongoose.connect(db, {
        useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;