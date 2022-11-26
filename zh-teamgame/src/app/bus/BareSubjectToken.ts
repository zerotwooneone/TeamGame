export class BareSubjectToken {
    constructor(readonly name: string) { }
    get type(): string {
        return "BusUnit";
    }
}
