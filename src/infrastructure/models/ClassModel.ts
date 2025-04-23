import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  subjects: string[];
  isDeleted: boolean;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const classModel = mongoose.model<IClass>("Class", classSchema);
export default classModel;
