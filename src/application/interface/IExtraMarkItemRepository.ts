import ExtraMarkItem from "../../domain/entites/ExtraMarkItem";

export interface IExtraMarkItemRepository {
    addItem(item:string,description:string): Promise<ExtraMarkItem>;
    getItems(): Promise<ExtraMarkItem[]>;
    getItemById(id: string): Promise<ExtraMarkItem | null>;
    updateItem(id: string,item:string,description:string): Promise<ExtraMarkItem>;
    deleteItem(id: string): Promise<void>;
}