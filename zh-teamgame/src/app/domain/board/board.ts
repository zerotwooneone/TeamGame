import { Space } from "../space/space";
import { Team } from "../team/team";
import { TeamLocation } from "../team/TeamLocation";
import { BoardLayout, ColumnArray, SpaceDetails } from "./BoardLayout";

export class Board {
    constructor(
        readonly rowCount: number,
        readonly columnCount: number,
        readonly rows: RowCollection,
        readonly spaceSize: number,
        readonly rowDefinition: string,
        readonly columnDefinition: string) { }
    public static Factory(
        layout: BoardLayout,
        teamTokenLookup: TeamLookup): Board {
        const columnCount = layout.rows.reduce((prevMax, column) => {
            if (column.length > prevMax) {
                return column.length;
            }
            return prevMax;
        }, 0);
        const rowCount = layout.rows.length;
        const rowDefinition = this.getGridDefinition(layout.spaceSize, rowCount);
        const columnDefinition = this.getGridDefinition(layout.spaceSize, columnCount);

        return new Board(
            rowCount,
            columnCount,
            this.GetRows(layout.rows, teamTokenLookup),
            layout.spaceSize,
            rowDefinition,
            columnDefinition
        )
    }
    private static GetRows(
        rows: readonly ColumnArray[],
        teamLookup: TeamLookup): RowCollection {
        const handleSpaces = (s: SpaceDetails) => {
            if (s.teamId && !teamLookup[s.teamId]) {
                console.error(`couldn't find team token for id:${s.teamId}`);
            }
            const team = s.teamId
                ? teamLookup[s.teamId]
                : null;
            return Space.Factory(
                !s.impassible,
                team);
        }
        return rows.map(r => r.map(handleSpaces));
    }
    private static getGridDefinition(size: number, count: number): string {
        const pixelSize = `${size}px`;
        return Array
            .from({ length: count })
            .map(_ => pixelSize)
            .reduce((prev, curr) => `${prev} ${curr}`);
    }
    public moveTeam(team: Team,
        newLocation: TeamLocation) {
        this.removeTeam(team.token.location);
        this.addTeam(team, newLocation);
    }
    private addTeam(team: Team, location: TeamLocation) {
        const space = this.rows[location.row][location.column];
        space.addTeam(team);
    }
    private removeTeam(location: TeamLocation) {
        const space = this.rows[location.row][location.column];
        if (!space.team$.nullable.value) {
            console.warn(`cannot remove team from space r:${location.row} c:${location.column}`);
            return;
        }
        space.removeTeam();
    }
}

type TeamLookup = Readonly<{ readonly [id: string]: Team }>;

export type RowCollection = readonly Row[];
export type Row = readonly Space[];


