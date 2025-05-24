class ExtraMarkItem{
    public readonly id!:string;
    public item!: string;
    public description!: string;
    public isDeleted?: boolean;
    constructor(data: Partial<ExtraMarkItem>) {
        Object.assign(this, data);
    }
}

export default ExtraMarkItem