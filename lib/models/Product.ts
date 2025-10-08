// lib/models/Product.ts
import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['slippers', 'frocks', 'blouses', 'skirts', 'pants', 'bags'],
    required: true
  },
  price: { type: Number, required: true }, // store cents
  description: String,

  images: { type: [String], default: [], required: true },
  image: { type: String }, // legacy cover

  // NEW
  colors: { type: [String], default: [] }, // hex or named strings
  sizes:  { type: [String], default: [] }, // e.g., ['XS','M'] or ['38','40'] for slippers
}, { timestamps: true });

export default models.Product || model('Product', ProductSchema);
