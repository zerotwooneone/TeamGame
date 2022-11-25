import { NeighborCollection } from './NeighborCollection';
import { SpaceContent } from './SpaceContent';

export interface SpaceConfig {
    readonly neighbors: NeighborCollection;
    readonly contents: readonly SpaceContent[];
    readonly passable?: boolean;
    readonly rowIndex: number;
    readonly columnIndex: number;
}


