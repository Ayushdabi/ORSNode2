{/* mongoose.connect('mongodb://mongo:27017/testexpress', */ }
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/testexpress', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Connection error: ', err);
});

module.exports = mongoose;