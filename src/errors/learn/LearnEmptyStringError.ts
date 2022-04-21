import LearnError from "./LearnError.js";

export default class LearnEmptyStringError extends LearnError {
    constructor() {
        super("La réponse ou la question est vide !");
    }
}