export class Round {
    constructor(
        readonly id: number,
        readonly end: Date,
        readonly maxActions: number) { }
    public static Factory(
        id: number,
        end: Date,
        maxActions: number): Round {
        return new Round(
            id,
            end,
            maxActions
        );
    }
}
