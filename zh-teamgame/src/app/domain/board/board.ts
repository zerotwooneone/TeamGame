import { Space } from "../space/space";
import { BoardLayout, ColumnArray, SpaceDetails } from "./BoardLayout";

export class Board {
    constructor(
        readonly rowCount: number,
        readonly columnCount: number,
        readonly rows: RowCollection,
        readonly spaceSize: number,
        readonly rowDefinition: string,
        readonly columnDefinition: string) { }
    public static Factory(layout: BoardLayout): Board {
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
            this.GetRows(layout.rows),
            layout.spaceSize,
            rowDefinition,
            columnDefinition
        )
    }
    private static GetRows(rows: readonly ColumnArray[]): RowCollection {
        const handleSpaces = (s: SpaceDetails) => {
            return Space.Factory(
                !s.impassible,
                s.teamId);
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
}

export type RowCollection = readonly Row[];
export type Row = readonly Space[];

