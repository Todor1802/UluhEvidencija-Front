export class Exibition {
    id!: number;
    title!: string;
    description?: string;
    startDate!: Date;
    endDate?: Date;
    coverImagePath?: string;
    isActive!: boolean;
    locationId!: number;
}
