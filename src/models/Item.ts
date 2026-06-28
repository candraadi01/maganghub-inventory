import mongoose, { Schema } from "mongoose";

export const ITEM_CATEGORIES = [
  "Aset",
  "Aset Digital",
  "Dokumen",
  "Tugas",
  "Catatan",
] as const;

export const ITEM_STATUSES = ["Draft", "Progress", "Done"] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export type ItemDocument = {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: ItemCategory;
  status: ItemStatus;
  description: string;
  activityDate: Date;
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
      minlength: 3,
    },
    category: {
      type: String,
      enum: ITEM_CATEGORIES,
      required: true,
      default: "Tugas",
    },
    status: {
      type: String,
      enum: ITEM_STATUSES,
      default: "Draft",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    activityDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    imageUrl: String,
    imagePublicId: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Item =
  mongoose.models.Item || mongoose.model<ItemDocument>("Item", ItemSchema);

export default Item;