import { BareSubjectToken } from "src/app/bus/BareSubjectToken";
import { SubjectToken } from "src/app/bus/SubjectToken";

export class Topics {
    /**Provides the id of the game whose round updated */
    static readonly NewRound: SubjectToken<string> = new SubjectToken<string>("NewRound", "string");
}