export class Space {
    get passible(): boolean {
        return this._passible;
    }
    constructor(private _passible: boolean) { }
    public static Factory(passible: boolean): Space {
        return new Space(passible);
    }
}
