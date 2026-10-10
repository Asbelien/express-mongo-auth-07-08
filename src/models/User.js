import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    url_profile: {
        type: String,
        trim: true
    },
    adress: {
        type: String,
        trim: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

UserSchema.virtual('age').get(function () {
    if (!this.birthdate) return null;
    const today = new Date();
    let age = today.getFullYear() - this.birthdate.getFullYear();
    const month = today.getMonth() - this.birthdate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < this.birthdate.getDate())) age--;
    return age;
});

export default mongoose.model('User', UserSchema);