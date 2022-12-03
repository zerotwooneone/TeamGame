export enum ShapePath {
    Circle = "assets/team-tokens/circle.white.svg",
    Hexagon = "assets/team-tokens/hexagon.white.svg",
    Pentagon = "assets/team-tokens/pentagon.white.svg",
    Spiral = "assets/team-tokens/spiral.white.svg",
    Square = "assets/team-tokens/square.white.svg",
    Star = "assets/team-tokens/star.white.svg",
    Triangle = "assets/team-tokens/triangle.white.svg"
}

export enum ShapeToken {
    Circle = "Circle",
    Hexagon = "Hexagon",
    Pentagon = "Pentagon",
    Spiral = "Spiral",
    Square = "Square",
    Star = "Star",
    Triangle = "Triangle"
}

export class CommonShapes {
    public static readonly Lookup: ShapeMap = CommonShapes.GetAll();
    public static toShapePath(sValue: string): ShapePath | undefined {
        const token = CommonShapes.toToken(sValue);
        if (!token) {
            return;
        }
        return CommonShapes.Lookup[token];
    }
    public static toToken(sValue: string): ShapeToken | undefined {
        return Object.values(ShapeToken).find(token => token === sValue);
    }
    private static GetAll(): ShapeMap {
        return {
            "Circle": ShapePath.Circle,
            "Hexagon": ShapePath.Hexagon,
            "Pentagon": ShapePath.Pentagon,
            "Spiral": ShapePath.Spiral,
            "Square": ShapePath.Square,
            "Star": ShapePath.Star,
            "Triangle": ShapePath.Triangle
        };
    }
}

type ShapeMap = Readonly<{
    [ck in ShapeToken]: ShapePath;
}>;
