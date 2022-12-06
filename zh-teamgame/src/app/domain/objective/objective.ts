import { Color, ColorFilter } from "../model/color";
import { CommonShapes, ShapePath } from "../model/CommonShape";

export class Objective {
    constructor(
        readonly tokenized: readonly Tokenized[]
    ) { }
    public static Factory(
        strings: readonly ObjectiveConfig[]): Objective {
        const tokenized: Tokenized[] = [];
        let errors: string[] = [];
        for (const stringPart of strings) {
            if (!stringPart.token) {
                tokenized.push({
                    text: stringPart.text
                });
                continue;
            }
            const token = stringPart.token;
            if (token.team) {
                const colorAndShape = this.getColorAndShape(token.team.token);
                if (!colorAndShape) {
                    errors.push(`couldn't parse color and shape for objective team ${token.team.teamId}`);
                    continue;
                }
                tokenized.push({
                    token: {
                        team: {
                            id: token.team.teamId,
                            filter: colorAndShape.color,
                            shape: colorAndShape.shape
                        }
                    }
                });
                continue;
            }
            if (token.pickup) {
                const colorAndShape = this.getColorAndShape(token.pickup.token);
                if (!colorAndShape) {
                    errors.push(`couldn't parse color and shape for objective pickup ${token.pickup.pickupId}`);
                    continue;
                }
                tokenized.push({
                    token: {
                        pickup: {
                            id: token.pickup.pickupId,
                            filter: colorAndShape.color,
                            shape: colorAndShape.shape
                        }
                    }
                });
                continue;
            }
            if (token.dropOff) {
                const filter = Color.ToColorFilter(token.dropOff.color);
                if (!filter) {
                    errors.push(`couldn't parse color for objective dropoff ${token.dropOff.letter}`);
                    continue;
                }
                tokenized.push({
                    token: {
                        dropOff: {
                            letter: token.dropOff.letter,
                            filter: filter
                        }
                    }
                });
            }

        }

        return new Objective(
            tokenized
        );
    }
    static getColorAndShape(obj: ShapeStructure): { color: ColorFilter; shape: ShapePath; } | undefined {
        const color = Color.ToColorFilter(obj.color);
        if (!color) {
            return;
        }
        const shape = CommonShapes.toShapePath(obj.shape);
        if (!shape) {
            return;
        }
        return { color, shape };
    }
    /*private static getParts(stringPart: Tokenized): 
        {text: string, team?:undefined, pickup?: undefined, dropOff?:undefined} |
        { text?: undefined, team: TeamStructure, pickup?: undefined, dropOff?: undefined }|
        { text?: undefined, team?: undefined, pickup: PickupStructure, dropOff?: undefined }|
        { text?: undefined, team?: undefined, pickup?: undefined, dropOff: DropOffStructure } {
        if(!stringPart.token){
            return {text: stringPart.text ?? ""};
        }
        if(stringPart.token.team){
            return {team: stringPart.token.team}
        }
    }*/
}

export type ObjectiveConfig = {
    text: string,
    token?: undefined
} | {
    text?: undefined,
    token: TokenLike
}

export type TokenLike =
    { text: string, team?: undefined, pickup?: undefined, dropOff?: undefined } |
    { text?: undefined, team: TeamStructure, pickup?: undefined, dropOff?: undefined } |
    { text?: undefined, team?: undefined, pickup: PickupStructure, dropOff?: undefined } |
    { text?: undefined, team?: undefined, pickup?: undefined, dropOff: DropOffStructure };


interface DropOffStructure {
    letter: string;
    color: string;
}

interface PickupStructure {
    readonly pickupId: string;
    readonly token: ShapeStructure
}

interface TeamStructure {
    readonly teamId: string;
    readonly token: ShapeStructure
}

interface ShapeStructure {
    readonly shape: string;
    readonly color: string;
}

export type TokenConfig = {
    readonly text: string;
    readonly token: undefined;
} |
{
    readonly text: undefined;
    readonly token: string;
}

export type Tokenized = {
    text: string,
    token?: undefined
} | {
    text?: undefined,
    token: Token
};

export interface TokenLookup { [token: string]: Token };
export type Token = {
    readonly team: Readonly<{ readonly id: string, readonly filter: ColorFilter, readonly shape: ShapePath }>,
    readonly pickup?: undefined,
    readonly dropOff?: undefined,
} | {
    readonly team?: undefined,
    readonly pickup: Readonly<{ readonly id: string, readonly filter: ColorFilter, readonly shape: ShapePath }>,
    readonly dropOff?: undefined,
} | {
    readonly team?: undefined,
    readonly pickup?: undefined,
    readonly dropOff: Readonly<{ readonly filter: ColorFilter, readonly letter: string }>
}
