const mongoose = require('mongoose');

/** Cache connection state */
let isConnected = false;

/**
 * connectDB: Industry Standard Mongoose Connection
 */
const connectDB = async () => {

    if (isConnected) {
        console.log('⚡ Using existing connection');
        return;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ Error: MONGODB_URI is not defined.');
        process.exit(1);
    }

    try {
        const options = {
        maxPoolSize: 10,
        minPoolSize: 2,           
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,              
        retryWrites: true,
        retryReads: true,
        // Monitoring
        appName: 'ChitChat_App',  
        };

        const conn = await mongoose.connect(uri, options);
        
        // ✅ Verify connection state
        isConnected = conn.connections[0].readyState === 1;
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        setupLifecycleListeners();

    } catch (error) {

        let message;

        switch (true) {
            case error.message.includes('ENOTFOUND'):
                message = 'No internet connection or invalid MongoDB URI.';
                break;

            case error.message.includes('ETIMEDOUT'):
                message = 'Connection timed out. Database is taking too long to respond.';
                break;

            case error.message.includes('ECONNREFUSED'):
                message = 'Database refused the connection.';
                break;

            default:
                message = 'Something went wrong while connecting to database.';
        }

        console.error('🔴 MongoDB Error:', error?.message);
        process.exit(1);
    }
};

/** Lifecycle monitoring */
function setupLifecycleListeners() {
    mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('🟡 Disconnected - Auto-reconnect active');
        isConnected = false; 
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🟢 Reconnected successfully');
        isConnected = true; 
    });

    // Graceful shutdown (already perfect )
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
}

async function gracefulShutdown() {  
    console.log('🛑 Graceful shutdown initiated...');
    await mongoose.connection.close();
    console.log('🔻 MongoDB closed');
    process.exit(0);
}

module.exports = connectDB;