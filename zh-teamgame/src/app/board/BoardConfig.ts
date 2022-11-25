import { Observable } from "rxjs";
import { SpaceConfig } from "../space/SpaceConfig";

export interface BoardConfig {
    /**number of rows on board */
    readonly rowCount?: number;
    /**height in pixels of each row*/
    readonly rowSize?: number;
    /**number of columns on board */
    readonly columnCount?: number;
    /**width in pixels of each column*/
    readonly columnSize?: number;
    /**Callback to get a particular space's config */
    getSpaceConfig(rowIndex: number, columnIndex: number): SpaceConfig;
}
