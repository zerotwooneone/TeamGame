import { Color, ColorFilter } from "../model/color";

export class DropOff {
    constructor(
        readonly color: ColorFilter,
        readonly letter: string
    ) { }
    public static Factory(
        color: string,
        letter: string
    ) {
        const colorFilter = Color.ToColorFilter(color);
        if (!colorFilter) {
            throw new Error(`cannot create dropoff. color${color} not found`);
        }
        return new DropOff(
            colorFilter,
            letter.slice(0, 1).toUpperCase()
        )
    }
}


