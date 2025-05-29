import { IExtraMarkItemRepository } from "../../application/interface/IExtraMarkItemRepository";
import ExtraMarkItem from "../../domain/entites/ExtraMarkItem";
import ExtraMarkItemModel from "../models/ExtraMarkItemModel";


export class ExtraMarkItemRepository implements IExtraMarkItemRepository {
  async addItem(item: string, description: string): Promise<ExtraMarkItem> {
    const newItem = new ExtraMarkItemModel({
      item,
      description,
      isDeleted: false,
    });
    const savedItem = await newItem.save();
    return savedItem.toObject() as ExtraMarkItem;
  }

  async getItems(): Promise<ExtraMarkItem[]> {
    const items = await ExtraMarkItemModel.find({ isDeleted: false }).sort({createdAt:-1});
    return items.map((item) => item.toObject() as ExtraMarkItem);
  }

  async getItemById(id: string): Promise<ExtraMarkItem | null> {
    const item = await ExtraMarkItemModel.findById(id);
    if (!item) {
      return null;
    }
    return item.toObject() as ExtraMarkItem;
  }

  async deleteItem(id: string): Promise<void> {
    const item = await ExtraMarkItemModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!item) {
      throw new Error("Item not found");
    }
  }

  async updateItem(id: string, item: string, description: string): Promise<ExtraMarkItem> {
    const existingItem = await ExtraMarkItemModel.findById(id);
    if (!existingItem) {
      throw new Error("Item not found");
    }
    if (existingItem.isDeleted) {
      throw new Error("Item is deleted");
    }

    existingItem.item = item;
    existingItem.description = description;
    const updatedItem = await existingItem.save();
    return updatedItem.toObject() as ExtraMarkItem;
  }
}
