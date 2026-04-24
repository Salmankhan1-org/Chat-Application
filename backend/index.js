require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const GlobalErrorHandler = require('./middlewares/global.error.handler');
const connectDB = require('./config/connectdb');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();


const UserRoutes = require('./routes/User/routes.user');


const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.CLOUD_FRONTEND_URL,
    ];

    if (isLocalhost || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

//Health checkup routes
app.get('/api/v1/health', (request, response) => {
    response.status(200).json({ 
        success:true,
        status: 'UP', 
        db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
    });
});


//Routes
app.use('/api/v1/users', UserRoutes);




// Global Error handler
app.use(GlobalErrorHandler);

app.listen(PORT,()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})
