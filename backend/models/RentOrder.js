import mongoose from "mongoose";

const rentOrderSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hours: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "running", "completed", "cancelled"],
      default: "pending",
    },

    location: { type: String },
    date: { type: String }, // simple string (YYYY-MM-DD)
  },
  { timestamps: true }
);

const RentOrder = mongoose.model("RentOrder", rentOrderSchema);

export default RentOrder;
