export class Team implements ReadonlyTeam {
    constructor(
        readonly id: string,
        readonly location: TeamLocation) { }
}

export interface ReadonlyTeam {
    readonly id: string;
    readonly location: TeamLocation;
}

export interface TeamLocation {
    readonly row: number;
    readonly column: number;
}
