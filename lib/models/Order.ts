import { Schema, model, models, Types } from 'mongoose';

const OrderSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: Number
  }],
  subtotal: Number,
  status: { type: String, enum: ['pending','paid','shipped','cancelled'], default: 'pending' }
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);
