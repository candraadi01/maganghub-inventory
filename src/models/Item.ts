import mongoose, { Schema, models, model } from "mongoose";

export type ItemStatus = "Draft" | "Progress" | "Done";

export type ItemDocument = {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  status: ItemStatus;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const ItemSchema = new Schema<ItemDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Umum"
    },
    status: {
      type: String,
      enum: ["Draft", "Progress", "Done"],
      default: "Draft"
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    },
    imageUrl: String,
    imagePublicId: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Item = models.Item || model<ItemDocument>("Item", ItemSchema);

export default Item;
