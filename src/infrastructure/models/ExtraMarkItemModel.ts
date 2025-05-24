import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExtraMarkItem extends Document {
  item: string;
  description: string;
  isDeleted: boolean;
}

const ExtraMarkItemSchema: Schema = new Schema({
  item: { type: String, required: true },
  description: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const ExtraMarkItemModel: Model<IExtraMarkItem> = mongoose.model<IExtraMarkItem>("ExtraMarkItem", ExtraMarkItemSchema);
export default ExtraMarkItemModel;
