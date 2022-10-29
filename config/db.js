const mongoose= require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    });
    console.log(`MongoDB Connected: ${conn.connection.host}:5001`.cyan.underline.bold);
}

module.exports = connectDB;
