import mongoose, { Schema, Document } from "mongoose";

export interface ITheme extends Document {
    label:string,
    minMark:number,
    maxMark:number,
}

const themeSchema = new Schema({
  label: { type: String, required: true },
  minMark: { type: Number, required: true },
  maxMark: { type: Number, required: true },
});

const ThemeModel = mongoose.model<ITheme>("Theme", themeSchema);
export default ThemeModel;
