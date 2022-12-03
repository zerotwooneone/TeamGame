export enum PickupShapeSource {
    Circle = "assets/team-tokens/circle.white.svg",
    Hexagon = "assets/team-tokens/hexagon.white.svg",
    Pentagon = "assets/team-tokens/pentagon.white.svg",
    Spiral = "assets/team-tokens/spiral.white.svg",
    Square = "assets/team-tokens/square.white.svg",
    Star = "assets/team-tokens/star.white.svg",
    Triangle = "assets/team-tokens/triangle.white.svg"
}

export enum PickupShapeToken {
    Circle = "Circle",
    Hexagon = "Hexagon",
    Pentagon = "Pentagon",
    Spiral = "Spiral",
    Square = "Square",
    Star = "Star",
    Triangle = "Triangle"
}

export class PickupShapes {
    public static readonly Lookup: ShapeMap = PickupShapes.GetAll();
    public static toPickupShapeSource(sValue: string): PickupShapeSource | undefined {
        const token = PickupShapes.toToken(sValue);
        if (!token) {
            return;
        }
        return PickupShapes.Lookup[token];
    }
    public static toToken(sValue: string): PickupShapeToken | undefined {
        return Object.values(PickupShapeToken).find(token => token === sValue);
    }
    private static GetAll(): ShapeMap {
        return {
            "Circle": PickupShapeSource.Circle,
            "Hexagon": PickupShapeSource.Hexagon,
            "Pentagon": PickupShapeSource.Pentagon,
            "Spiral": PickupShapeSource.Spiral,
            "Square": PickupShapeSource.Square,
            "Star": PickupShapeSource.Star,
            "Triangle": PickupShapeSource.Triangle
        };
    }
}

type ShapeMap = Readonly<{
    [ck in PickupShapeToken]: PickupShapeSource;
}>;
