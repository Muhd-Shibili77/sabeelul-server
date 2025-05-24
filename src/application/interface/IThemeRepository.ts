import Theme from "../../domain/entites/Theme";

export interface IThemeRepository {
    getTheme(): Promise<Theme[]>;
    updateTheme(id: string, minMark: number, maxMark: number): Promise<Theme>;
}
    