import mongoose, { Schema, Document } from "mongoose";
export interface IProgram extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  criteria: string;
  isDeleted: boolean;
  classes: string[];
}

const programSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    criteria: {
      type: String,
      required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
    ],
  },

  { timestamps: true }
);

const programModel = mongoose.model<IProgram>("Program", programSchema);

export default programModel;
