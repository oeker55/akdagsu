import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Şifre hashleme
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema); 