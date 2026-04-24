const mongoose = require('mongoose');
const validator = require('validator'); 
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        index: true // Optimized for searching users
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Never return password in queries
    },
    profileImage: {
        publicId: {type:String, default:null},
        url: {type:String, default:null},
        resourceType: {type:String, default:null},
        originalName: {type:String, default:null},
        mimetype: {type:String, default:null}
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [160, 'Bio cannot exceed 160 characters']
    },
  
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    socketId: { 
        type: String, 
        default: null 
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    isDeleted:{
        type:Boolean,
        default:false,
        select:false
    },

    // Verify Email related fields
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String }, 
    verificationTokenExpiry: { type: Date },

}, { 
    timestamps: true
});


// Hash password before saving
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return;
//     this.password = await bcrypt.hash(this.password, 12);
// });

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.index({ username: 1, email: 1 }); 

const User = mongoose.model('User', userSchema);
module.exports = User;