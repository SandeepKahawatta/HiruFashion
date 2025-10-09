// lib/models/Order.ts
import { Schema, model, models, Types } from 'mongoose';

const AddressSchema = new Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
}, { _id: false });

const OrderItemSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },

  // User's chosen variant
  size: { type: String },
  color: { type: String },
  qty: { type: Number, required: true, min: 1 },

  // Snapshot (so history doesn’t break if product later changes)
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true }, // in cents
  image: { type: String },
}, { _id: false });

const OrderSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  email: String,
  name: String,

  shippingAddress: { type: AddressSchema, default: {} },
  billingAddress: { type: AddressSchema, default: {} },
  note: String,

  items: { type: [OrderItemSchema], required: true },
  subtotal: { type: Number, required: true }, // in cents

  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);
