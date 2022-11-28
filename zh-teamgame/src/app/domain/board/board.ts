import { Space } from "../space/space";
import { BoardLayout, ColumnArray, SpaceDetails } from "./BoardLayout";

export class Board {
    constructor(
        readonly rowCount: number,
        readonly columnCount: number,
        readonly rows: RowCollection
    ) { }
    public static Factory(layout: BoardLayout): Board {
        const columnCount = layout.rows.reduce((prevMax, column) => {
            if (column.length > prevMax) {
                return column.length;
            }
            return prevMax;
        }, 0);
        return new Board(
            layout.rows.length,
            columnCount,
            this.GetRows(layout.rows)
        )
    }
    private static GetRows(rows: readonly ColumnArray[]): RowCollection {
        const handleSpaces = (s: SpaceDetails) => {
            return Space.Factory(!s.impassible);
        }
        return rows.map(r => r.map(handleSpaces));
    }
}

type RowCollection = readonly Row[];
type Row = readonly Space[];


