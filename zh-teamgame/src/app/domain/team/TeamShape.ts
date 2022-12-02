
export enum TeamShapeSource {
    Circle = "assets/team-tokens/circle.white.svg",
    Hexagon = "assets/team-tokens/hexagon.white.svg",
    Pentagon = "assets/team-tokens/pentagon.white.svg",
    Spiral = "assets/team-tokens/spiral.white.svg",
    Square = "assets/team-tokens/square.white.svg",
    Star = "assets/team-tokens/star.white.svg",
    Triangle = "assets/team-tokens/triangle.white.svg"
}

export enum TeamShapeToken {
    Circle = "Circle",
    Hexagon = "Hexagon",
    Pentagon = "Pentagon",
    Spiral = "Spiral",
    Square = "Square",
    Star = "Star",
    Triangle = "Triangle"
}

export class TeamShapes {
    public static readonly Lookup: ShapeMap = TeamShapes.GetAll();
    public static toTeamShapeSource(sValue: string): TeamShapeSource | undefined {
        const token = TeamShapes.toToken(sValue);
        if (!token) {
            return;
        }
        return TeamShapes.Lookup[token];
    }
    public static toToken(sValue: string): TeamShapeToken | undefined {
        return Object.values(TeamShapeToken).find(token => token === sValue);
    }
    private static GetAll(): ShapeMap {
        return {
            "Circle": TeamShapeSource.Circle,
            "Hexagon": TeamShapeSource.Hexagon,
            "Pentagon": TeamShapeSource.Pentagon,
            "Spiral": TeamShapeSource.Spiral,
            "Square": TeamShapeSource.Square,
            "Star": TeamShapeSource.Star,
            "Triangle": TeamShapeSource.Triangle
        };
    }
}

type ShapeMap = Readonly<{
    [ck in TeamShapeToken]: TeamShapeSource;
}>;
