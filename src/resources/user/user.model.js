import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },
    likesFromUsers: [{
      ref: 'user',
      type: mongoose.Types.ObjectId,
      default: []
    }],
    settings: {
      theme: {
        type: String,
        required: true,
        default: 'dark'
      },
      notifications: {
        type: Boolean,
        required: true,
        default: true
      },
      compactMode: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  try{
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    return next()
  }catch(e){
    // We're throwing error here because, the parent function will catch it.
    throw e;
  }
});

userSchema.methods.checkPassword = async function(password) {
  const passwordHash = this.password
  return await bcrypt.compare(password, passwordHash);
};

export const User = mongoose.model('user', userSchema)
