class Theme{
    public readonly id!:string;
    public label!: string;
    public minMark!: number;
    public maxMark!: number;

    constructor(data: Partial<Theme>) {
        Object.assign(this, data);
    }
}
export default Theme;