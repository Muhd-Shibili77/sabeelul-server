import ThemeModel from "../../infrastructure/models/ThemeModel";

export const getLevelByMark = async (mark: number): Promise<string> => {
  const theme = await ThemeModel.findOne({
    minMark: { $lte: mark },
    maxMark: { $gte: mark },
  });

  return theme?.label || "Unknown";
};
