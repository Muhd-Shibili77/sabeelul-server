import { IThemeRepository } from "../../application/interface/IThemeRepository";
import Theme from "../../domain/entites/Theme";
import ThemeModel from "../models/ThemeModel";

export class ThemeRepository implements IThemeRepository {
  async getTheme(): Promise<Theme[]> {
    const themes = await ThemeModel.find();
    return themes.map((theme) => new Theme(theme.toObject() as Theme));
  }

  async updateTheme(
    id: string,
    minMark: number,
    maxMark: number
  ): Promise<Theme> {
    const updatedTheme = await ThemeModel.findByIdAndUpdate(
      id,
      { minMark, maxMark },
      { new: true }
    );
    if (!updatedTheme) {
      throw new Error("Theme not found");
    }
    return new Theme(updatedTheme.toObject() as Theme);
  }
}