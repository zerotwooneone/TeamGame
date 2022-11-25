import { Observable } from "rxjs";

export interface BoardConfig {
    rowCount?: number | Observable<number>;
    rowSize?: number | Observable<number>;
    columnCount?: number | Observable<number>;
    columnSize?: number | Observable<number>;
}
