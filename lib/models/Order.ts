// lib/models/Order.ts
import { Schema, model, models, Types } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    email: { type: String }, // stored for quick access
    name: { type: String },  // from session user
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    billingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    note: { type: String },

    items: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        qty: Number,
        size: String,
        color: String,
        image: String,
      },
    ],
    subtotal: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default models.Order || model('Order', OrderSchema);
