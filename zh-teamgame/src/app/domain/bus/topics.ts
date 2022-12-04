import { BareSubjectToken } from "src/app/bus/BareSubjectToken";
import { SubjectToken } from "src/app/bus/SubjectToken";

export class Topics {
    static readonly Test: SubjectToken<string> = new SubjectToken<string>("Test", "string");
}