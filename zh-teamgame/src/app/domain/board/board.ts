import { Space, SpaceTeam } from "../space/space";
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
        teamTokenLookup: teamTokenLookup): Board {
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
        teamTokenLookup: teamTokenLookup): RowCollection {
        const handleSpaces = (s: SpaceDetails) => {
            if (s.teamId && !teamTokenLookup[s.teamId]) {
                console.error(`couldn't find team token for id:${s.teamId}`);
            }
            const token = s.teamId
                ? teamTokenLookup[s.teamId]
                : null;
            const teamParam = (s.teamId && token)
                ? { id: s.teamId, token: token }
                : null;
            return Space.Factory(
                !s.impassible,
                teamParam);
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
    public moveTeam(team: SpaceTeam,
        oldLocation: TeamLocation,
        newLocation: TeamLocation) {
        this.removeTeam(oldLocation);
        this.addTeam(team, newLocation);
    }
    private addTeam(team: SpaceTeam, location: TeamLocation) {
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

type teamTokenLookup = { readonly [id: string]: string }

export type RowCollection = readonly Row[];
export type Row = readonly Space[];


