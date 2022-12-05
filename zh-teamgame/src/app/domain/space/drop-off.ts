export class DropOff {
    constructor(
        readonly color: string,
        readonly letter: string
    ) { }
    public static Factory(
        color: string,
        letter: string
    ) {
        return new DropOff(
            color,
            letter.slice(0, 1).toUpperCase()
        )
    }
}


