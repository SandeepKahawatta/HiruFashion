import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false }, // Optional for Google users
  googleId: { type: String, unique: true, sparse: true }, // Sparse allows multiple nulls
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wishlist: { type: [String], default: [] } // Array of Product IDs
}, { timestamps: true });

export default models.User || model('User', UserSchema);
