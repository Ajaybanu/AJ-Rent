const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        mongoose.set('strictQuery', true);

        await mongoose.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to the MongoDB Atlas database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = connect;
