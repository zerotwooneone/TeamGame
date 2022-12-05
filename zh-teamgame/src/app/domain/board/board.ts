import { Space } from "../space/space";
import { Team } from "../team/team";
import { BoardLocationConfig } from "../space/BoardLocation";
import { BoardLayout, ColumnArray, SpaceDetails } from "./BoardLayout";
import { Pickup } from "../pickup/pickup";
import { DropOff } from "../space/drop-off";

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
        pickupLookup: Readonly<PickupByBoardLocation>,
        dropOffLookup: Readonly<DropoffByLocation>): Board {
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
            this.CreateRows(layout.rows, teamTokenLookup, pickupLookup, dropOffLookup),
            layout.spaceSize,
            rowDefinition,
            columnDefinition
        )
    }
    private static CreateRows(
        rows: readonly ColumnArray[],
        teamLookup: Readonly<TeamByBoardLocation>,
        pickupLookup: Readonly<PickupByBoardLocation>,
        dropOffLookup: Readonly<DropoffByLocation>): RowCollection {
        const handleSpaces = (
            s: SpaceDetails,
            rowIndex: number,
            columnIndex: number) => {
            const team = teamLookup[rowIndex]?.[columnIndex];
            const pickup = pickupLookup[rowIndex]?.[columnIndex];
            const dropoff = dropOffLookup[rowIndex]?.[columnIndex];
            return Space.Factory(
                !s.impassible,
                team,
                pickup,
                dropoff);
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
        //todo: check valid location
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
    public hasPickup(location: BoardLocationConfig): boolean {
        const space = this.getSpace(location);
        if (!space) {
            return false;
        }
        return space.canRemovePickup;
    }
    private getSpace(location: BoardLocationConfig): Space | undefined {
        if (!this.validLocation(location)) {
            console.error("cannot get space, bad location", location);
            return undefined;
        }
        return this.rows[location.row][location.column];
    }

    private validLocation(location: BoardLocationConfig): boolean {
        return location.row >= 0 &&
            location.column >= 0 &&
            location.row < this.rowCount &&
            location.column < this.columnCount
    }
    public removePickup(location: BoardLocationConfig): Pickup | undefined {
        if (!this.validLocation(location)) {
            console.error("cannot remove pickup, bad location", location);
            return undefined;
        }
        const space = this.getSpace(location);
        if (!space) {
            console.error("cannot remove pickup, space does not exist", location);
            return undefined;
        }
        return space.removePickup();
    }
    public addPickup(pickup: Pickup, location: BoardLocationConfig): void {
        if (!this.validLocation(location)) {
            console.error("cannot remove pickup, bad location", location);
            return undefined;
        }
        const space = this.getSpace(location);
        if (!space) {
            console.error("cannot remove pickup, space does not exist", location);
            return undefined;
        }
        space.addPickup(pickup);
    }
}

type boardLocationLookup<T> = { [rowIndex: number]: { [columnIndex: number]: T } };
export type TeamByBoardLocation = boardLocationLookup<Team>;
export type PickupByBoardLocation = boardLocationLookup<Pickup>;
export type DropoffByLocation = boardLocationLookup<DropOff>;

export type RowCollection = readonly Row[];
export type Row = readonly Space[];


