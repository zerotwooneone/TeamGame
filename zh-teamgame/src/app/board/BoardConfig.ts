import { Observable } from "rxjs";

export interface BoardConfig {
    /**number of rows on board */
    rowCount?: number;
    /**height in pixels of each row*/
    rowSize?: number;
    /**number of columns on board */
    columnCount?: number;
    /**width in pixels of each column*/
    columnSize?: number;
}
