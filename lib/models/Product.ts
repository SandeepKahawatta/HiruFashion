import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: String,
  price: { type: Number, required: true }, // store cents
  description: String,
  images: { type: [String], default: [], required: true },
  image: { type: String } // Cloudinary URL
}, { timestamps: true });

export default models.Product || model('Product', ProductSchema);
