const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado ao MongoDB');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;
