import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    previousQuantity: {
      type: Number,
      required: [true, 'Previous quantity is required'],
    },
    newQuantity: {
      type: Number,
      required: [true, 'New quantity is required'],
    },
    changeAmount: {
      type: Number,
      required: [true, 'Change amount is required'],
    },
    actionType: {
      type: String,
      required: [true, 'Action type is required'],
      enum: ['add', 'remove', 'update', 'initial', 'adjustment'],
    },
    reason: {
      type: String,
      default: '',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Performed by user is required'],
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ product: 1, createdAt: -1 });
inventorySchema.index({ performedBy: 1 });
inventorySchema.index({ actionType: 1 });

export default mongoose.model('Inventory', inventorySchema);
