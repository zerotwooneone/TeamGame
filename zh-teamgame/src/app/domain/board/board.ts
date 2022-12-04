import { Space } from "../space/space";
import { Team } from "../team/team";
import { BoardLocationConfig } from "../space/BoardLocation";
import { BoardLayout, ColumnArray, SpaceDetails } from "./BoardLayout";
import { Pickup } from "../pickup/pickup";

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
        teamTokenLookup: Readonly<TeamByBoardLocation>,
        pickupLookup: Readonly<PickupByBoardLocation>): Board {
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
            this.GetRows(layout.rows, teamTokenLookup, pickupLookup),
            layout.spaceSize,
            rowDefinition,
            columnDefinition
        )
    }
    private static GetRows(
        rows: readonly ColumnArray[],
        teamLookup: Readonly<TeamByBoardLocation>,
        pickupLookup: Readonly<PickupByBoardLocation>): RowCollection {
        const handleSpaces = (
            s: SpaceDetails,
            rowIndex: number,
            columnIndex: number) => {
            const team = teamLookup[rowIndex]?.[columnIndex];
            const pickup = pickupLookup[rowIndex]?.[columnIndex];
            return Space.Factory(
                !s.impassible,
                team,
                pickup);
        }
        return rows.map((row, rowIndex) =>
            row.map((space, columnIndex) =>
                handleSpaces(space, rowIndex, columnIndex)));
    }
    private static getGridDefinition(size: number, count: number): string {
        const pixelSize = `${size}px`;
        return Array
            .from({ length: count })
            .map(_ => pixelSize)
            .reduce((prev, curr) => `${prev} ${curr}`);
    }
    public moveTeam(team: Team,
        newLocation: BoardLocationConfig) {
        this.removeTeam(team.token.location);
        this.addTeam(team, newLocation);
        team.token.move(newLocation);
    }
    private addTeam(team: Team, location: BoardLocationConfig) {
        const space = this.rows[location.row][location.column];
        space.addTeam(team);
    }
    private removeTeam(location: BoardLocationConfig) {
        const space = this.rows[location.row][location.column];
        if (!space.team$.nullable.value) {
            console.warn(`cannot remove team from space r:${location.row} c:${location.column}`);
            return;
        }
        space.removeTeam();
    }
}

type boardLocationLookup<T> = { [rowIndex: number]: { [columnIndex: number]: T } };
export type TeamByBoardLocation = boardLocationLookup<Team>;
export type PickupByBoardLocation = boardLocationLookup<Pickup>;

export type RowCollection = readonly Row[];
export type Row = readonly Space[];


